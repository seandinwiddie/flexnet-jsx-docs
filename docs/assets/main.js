document.addEventListener('DOMContentLoaded', () => {
    const loadComponent = (id, url) => {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load ${url}: ${response.statusText}`);
                }
                return response.text();
            })
            .then(html => {
                const placeholder = document.getElementById(id);
                if (placeholder) {
                    placeholder.innerHTML = html;
                } else {
                    console.warn(`Placeholder with id '${id}' not found.`);
                }
            })
            .catch(error => console.error(`Error loading component ${url}:`, error));
    };

    Promise.all([
        loadComponent('sidebar-placeholder', '/templates/sidebar.html'),
        loadComponent('header-placeholder', '/templates/header.html'),
        loadComponent('footer-placeholder', '/templates/footer.html')
    ]).then(() => {
        console.log('All components loaded.');
        // Initialize any scripts that depend on the loaded content here
        // For example, activating sidebar links
        const currentPath = window.location.pathname;
        const sidebarLinks = document.querySelectorAll('#sidebar-placeholder a');
        sidebarLinks.forEach(link => {
            // Check if the link's href is a substring of the current path
            if (currentPath.endsWith(link.getAttribute('href'))) {
                link.classList.add('bg-blue-500', 'text-white');
            }
        });
    });

    //
    // copy button on code blocks
    //
    const codeBlocks = document.querySelectorAll('.bg-gray-900');

    codeBlocks.forEach(block => {
        const button = block.querySelector('button');
        const pre = block.querySelector('pre');
        if (button && pre) {
            button.addEventListener('click', () => {
                const code = pre.innerText;
                navigator.clipboard.writeText(code).then(() => {
                    button.innerText = 'Copied!';
                    setTimeout(() => {
                        button.innerText = 'Copy';
                    }, 2000);
                });
            });
        }
    });
});
