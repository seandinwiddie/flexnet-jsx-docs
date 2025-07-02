import Either from '../../../core/types/either.js';

export const executeBrowserAPIEffect = async (effect) => {
    const { operation, payload } = effect;

    switch (operation) {
        case 'geolocation':
            if (!navigator.geolocation) {
                return Either.Left('Geolocation not supported');
            }

            return new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                    position => resolve(Either.Right({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    })),
                    error => resolve(Either.Left(error.message)),
                    payload.options
                );
            });

        case 'notification':
            if (!('Notification' in window)) {
                return Either.Left('Notifications not supported');
            }

            if (Notification.permission === 'granted') {
                return Either.Right(createNotificationEffect(payload.title, payload.options));
            } else if (Notification.permission !== 'denied') {
                return new Promise((resolve) => {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            resolve(Either.Right(createNotificationEffect(payload.title, payload.options)));
                        } else {
                            resolve(Either.Left('Notification permission denied'));
                        }
                    });
                });
            } else {
                return Either.Left('Notification permission denied');
            }

        default:
            return Either.Left(`Unknown browser API operation: ${operation}`);
    }
};

// Helper for notification creation
const createNotificationEffect = (title, options) => {
    const notification = Object.create(Notification.prototype);
    notification.title = title;
    notification.options = options;
    return notification;
}; 