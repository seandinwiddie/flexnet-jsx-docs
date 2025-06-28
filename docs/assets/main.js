// === Single File Architecture for FlexNet JSX Docs ===
// Conforms to principles in api-reference.md, ARCHITECTUREOVERVIEW.md, etc.

document.addEventListener('DOMContentLoaded', () => {

    const init = () => {
        // --- Core Types (from api-reference.md) ---

        const Maybe = {
            Just: value => ({ type: 'Just', value }),
            Nothing: () => ({ type: 'Nothing' }),
            fromNullable: value => (value !== null && value !== undefined) ? Maybe.Just(value) : Maybe.Nothing(),
            map: fn => maybe =>
                maybe.type === 'Just' ? Maybe.Just(fn(maybe.value)) : Maybe.Nothing(),
            chain: fn => maybe =>
                maybe.type === 'Just' ? fn(maybe.value) : Maybe.Nothing(),
            getOrElse: defaultValue => maybe =>
                maybe.type === 'Just' ? maybe.value : defaultValue,
        };

        const Either = {
            Left: value => ({ type: 'Left', value }),
            Right: value => ({ type: 'Right', value }),
            fromNullable: value => value != null ? Either.Right(value) : Either.Left('Value is null'),
            map: fn => either =>
                either.type === 'Right' ? Either.Right(fn(either.value)) : either,
            chain: fn => either =>
                either.type === 'Right' ? fn(either.value) : either,
        };
        
        const Result = {
            Ok: value => ({ type: 'Ok', value }),
            Error: error => ({ type: 'Error', error }),
            fromTry: fn => {
                try {
                    return Result.Ok(fn());
                } catch (e) {
                    return Result.Error(e);
                }
            },
            map: fn => result =>
                result.type === 'Ok' ? Result.Ok(fn(result.value)) : result,
            chain: fn => result =>
                result.type === 'Ok' ? fn(result.value) : result,
        };

        // --- Core Functions (from api-reference.md) ---
        const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);
        const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
        const curry = fn => (...args) =>
            args.length >= fn.length ? fn(...args) : curry(fn.bind(null, ...args));

        // --- Utility Functions (from api-reference.md) ---
        const head = array => Maybe.fromNullable(array[0]);
        const tail = array => array.length > 1 ? Maybe.Just(array.slice(1)) : Maybe.Nothing();
        const find = predicate => array => Maybe.fromNullable(array.find(predicate));

        // --- Security Functions (from security-practices.md) ---
        const escape = str => compose(
            String,
            s => s.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&#039;')
        )(str);

        const validateInput = predicate => input =>
            Either.fromNullable(input)
                .chain(value =>
                    predicate(value)
                        ? Either.Right(value)
                        : Either.Left('Invalid input')
                );

        const sanitizeUrl = url => {
            const allowedProtocols = ['https:', 'http:', 'data:'];
            try {
                const parsed = new URL(url, window.location.origin);
                return allowedProtocols.some(protocol => 
                    parsed.protocol === protocol)
                    ? Either.Right(url)
                    : Either.Left('Invalid protocol');
            } catch {
                return Either.Left('Invalid URL');
            }
        };

        // --- Application-specific Pure Functions ---
        const getBasePath = () => {
            const path = window.location.pathname;
            // On deployed sites, the root path might be just '/', which is correct.
            // On local file system, we need to calculate depth.
            if (path === '/' || (path.endsWith('/') && !path.endsWith('.html'))) {
                return '.';
            }
            const segments = path.split('/').filter(Boolean);
            const depth = path.endsWith('.html') ? segments.length - 1 : segments.length;
            if (depth <= 0) return '.';
            return Array(depth).fill('..').join('/');
        };

        const createBreadcrumbSegment = (seg, idx, pathSegments) => {
            const cumulativePath = `/${pathSegments.slice(0, idx + 1).join('/')}`;
            const name = seg.replace('.html', '').replace(/-/g, ' ');
            const displayName = escape(name.charAt(0).toUpperCase() + name.slice(1));
            
            return {
                path: cumulativePath,
                displayName,
                isLast: idx === pathSegments.length - 1
            };
        };

        // --- Effectful Functions (Side Effects Wrapper) ---
        const query = selector => Maybe.fromNullable(document.querySelector(selector));
        const queryAll = selector => Array.from(document.querySelectorAll(selector));

        const safeSetHTML = html => element => 
            Result.fromTry(() => {
                if (!element) throw new Error('Element is null');
                element.innerHTML = '';
                const parsed = new DOMParser().parseFromString(html, 'text/html');
                Array.from(parsed.body.childNodes).forEach(node => {
                    if (node) element.appendChild(node.cloneNode(true));
                });
                return element;
            });
        
        const addListener = curry((event, handler, element) => {
            element.addEventListener(event, handler);
            return element;
        });

        const fetchResource = async (url) => {
            const urlValidation = sanitizeUrl(url);
            if (urlValidation.type === 'Left') {
                return Result.Error(new Error(`Invalid URL: ${urlValidation.value}`));
            }

            try {
                const response = await fetch(url);
                if (!response.ok) {
                    return Result.Error(new Error(`Request failed for ${url}: ${response.statusText}`));
                }
                return Result.Ok(await response.text());
            } catch (e) {
                console.error(`[fetchResource] A critical error occurred fetching ${url}:`, e);
                return Result.Error(e);
            }
        };
        
        // --- UI Initialization Functions ---
        const loadComponent = async (placeholderId, url) => {
            const result = await fetchResource(url);

            if (result.type === 'Error') {
                console.warn(`Error loading component ${url}:`, result.error);
                return Result.Error(result.error);
            }

            const html = result.value;
            const maybePlaceholder = query(`#${placeholderId}`);
            
            if (maybePlaceholder.type === 'Nothing') {
                console.warn(`Placeholder element #${placeholderId} not found in the layout.`);
                return Result.Error(new Error('Placeholder not found'));
            }

            return pipe(
                maybePlaceholder,
                Maybe.map(safeSetHTML(html)),
                Maybe.getOrElse(Result.Error(new Error('Failed to set HTML')))
            );
        };

        const setupLogo = (basePath) => {
            console.log("[UI Setup] Initializing logo.");
            return pipe(
                query('#logo-image'),
                Maybe.map(img => {
                    img.src = `${basePath}/flexnet.png`;
                    return img;
                }),
                Maybe.getOrElse(null)
            );
        };

        const setupSyntaxHighlighting = () => {
            console.log("[UI Setup] Initializing syntax highlighting.");
            return Result.fromTry(() => {
                if (window.hljs) {
                    window.hljs.highlightAll();
                    return 'Syntax highlighting initialized';
                }
                return 'hljs not available';
            });
        };
        
        const setupThemeSwitcher = () => {
            console.log("[UI Setup] Initializing theme switcher.");
            return pipe(
                query('#theme-toggle'),
                Maybe.map(addListener('click', () => {
                    const html = document.documentElement;
                    html.classList.toggle('dark');
                    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
                })),
                Maybe.getOrElse(null)
            );
        };

        const setupSidebarAccordion = () => {
            console.log("[UI Setup] Initializing sidebar accordion.");
            return pipe(
                query('#sidebar-placeholder nav'),
                Maybe.map(sidebarNav => {
                    const sections = queryAll('h3', sidebarNav)
                        .map(h3 => ({ header: h3, content: h3.nextElementSibling }))
                        .filter(section => section.content && section.content.tagName === 'UL');
            
                    const currentPath = window.location.pathname;
            
                    const getActiveSection = () => {
                        return find(section => {
                            const links = Array.from(section.content.querySelectorAll('a'));
                            links.push(section.header.querySelector('a'));
                            return links.some(link => link && currentPath.endsWith(link.getAttribute('href')));
                        })(sections);
                    };
            
                    const activeSection = getActiveSection();
            
                    sections.forEach(section => {
                        const isSectionActive = activeSection.type === 'Just' && activeSection.value === section;
                        const contentIsHidden = !isSectionActive;
                        section.content.classList.toggle('hidden', contentIsHidden);
            
                        section.header.style.cursor = 'pointer';
                        addListener('click', e => {
                            if (e.target.tagName !== 'A') e.preventDefault();
                            
                            const isHidden = section.content.classList.contains('hidden');
                            if(isHidden) {
                                sections.forEach(s => {
                                    if (s !== section) {
                                        s.content.classList.add('hidden');
                                    }
                                });
                                section.content.classList.remove('hidden');
                            } else {
                                section.content.classList.add('hidden');
                            }
                        }, section.header);
                    });
                    return sections;
                }),
                Maybe.getOrElse([])
            );
        };

        const setupSidebarActiveLink = () => {
            console.log("[UI Setup] Initializing sidebar active link.");
            const currentPath = window.location.pathname;
            return queryAll('#sidebar-placeholder a')
                .filter(link => currentPath.endsWith(link.getAttribute('href')))
                .map(link => {
                    link.classList.add('bg-blue-500', 'text-white');
                    link.classList.remove('dark:text-gray-300');
                    return link;
                });
        };

        const setupMobileSidebar = () => {
            console.log("[UI Setup] Initializing mobile sidebar.");
            const sidebar = query('#sidebar-placeholder');
            const overlay = query('#sidebar-overlay');
        
            const closeSidebar = () => {
                pipe(sidebar, Maybe.map(s => s.classList.add('-translate-x-full')));
                pipe(overlay, Maybe.map(o => o.classList.add('hidden')));
            };
        
            const openSidebar = () => {
                pipe(sidebar, Maybe.map(s => s.classList.remove('-translate-x-full')));
                pipe(overlay, Maybe.map(o => o.classList.remove('hidden')));
            };
        
            pipe(query('#sidebar-toggle'), Maybe.map(addListener('click', openSidebar)));
            pipe(overlay, Maybe.map(addListener('click', closeSidebar)));
            
            return { closeSidebar, openSidebar };
        };

        const setupBreadcrumbs = () => {
            console.log("[UI Setup] Initializing breadcrumbs.");
            return pipe(
                query('#breadcrumbs'),
                Maybe.map(container => {
                    container.innerHTML = '';
                    const pathSegments = window.location.pathname.split('/').filter(Boolean);
                    
                    const homeLink = document.createElement('a');
                    homeLink.href = `${getBasePath()}/index.html`;
                    homeLink.className = 'text-gray-600 dark:text-gray-400 hover:underline';
                    homeLink.textContent = 'Home';
                    container.appendChild(homeLink);
                    
                    pathSegments.forEach((seg, idx) => {
                        container.insertAdjacentText('beforeend', ' / ');
                        const segment = createBreadcrumbSegment(seg, idx, pathSegments);
            
                        if (segment.isLast) {
                            const breadcrumb = document.createElement('span');
                            breadcrumb.className = 'text-gray-800 dark:text-gray-200';
                            breadcrumb.textContent = segment.displayName;
                            container.appendChild(breadcrumb);
                        } else {
                            const breadcrumb = document.createElement('a');
                            breadcrumb.href = segment.path;
                            breadcrumb.className = 'text-gray-600 dark:text-gray-400 hover:underline';
                            breadcrumb.textContent = segment.displayName;
                            container.appendChild(breadcrumb);
                        }
                    });
                    return container;
                }),
                Maybe.getOrElse(null)
            );
        };
        
        const setupCopyButtons = () => {
            console.log("[UI Setup] Initializing copy buttons.");
            return queryAll('pre')
                .map(pre => {
                    const parent = pre.parentElement;
                    const button = parent ? parent.querySelector('button') : null;
                    if (button) {
                        addListener('click', () => {
                            navigator.clipboard.writeText(pre.innerText).then(() => {
                                button.innerText = 'Copied!';
                                setTimeout(() => { button.innerText = 'Copy'; }, 2000);
                            });
                        }, button);
                        return button;
                    }
                    return null;
                })
                .filter(Boolean);
        };

        const setupUI = async (basePath) => {
            console.log("[UI Setup] Initializing all UI components.");
            const results = {
                logo: setupLogo(basePath),
                themeSwitcher: setupThemeSwitcher(),
                mobileSidebar: setupMobileSidebar(),
                breadcrumbs: setupBreadcrumbs(),
                copyButtons: setupCopyButtons(),
                sidebarActiveLink: setupSidebarActiveLink(),
                sidebarAccordion: setupSidebarAccordion(),
                syntaxHighlighting: setupSyntaxHighlighting()
            };
            console.log("[UI Setup] All components are set up.");
            return results;
        };

        // --- Main Application Logic ---
        const main = async () => {
            console.log("Main function started. Preparing to fetch layout.");
            
            const pageContent = pipe(
                query('#page-content'),
                Maybe.map(el => el.innerHTML),
                Maybe.getOrElse('')
            );
            
            const basePath = getBasePath();
            const layoutUrl = `${basePath}/templates/layout.html`;
            console.log(`Fetching layout from: ${layoutUrl}`);

            const layoutResult = await fetchResource(layoutUrl);

            if (layoutResult.type === 'Error') {
                console.error("Failed to load layout:", layoutResult.error);
                const root = query('#root');
                pipe(
                    root,
                    Maybe.map(safeSetHTML(
                        `<div style="color: red; padding: 2rem; font-family: monospace;">
                            <h1>Critical Error</h1>
                            <p>Could not load page layout. Please check the console for more details.</p>
                            <p><strong>Error:</strong> ${escape(layoutResult.error.message)}</p>
                        </div>`
                    ))
                );
                return Result.Error(layoutResult.error);
            }
            
            const layoutHtml = layoutResult.value;
            let containerEl = document.getElementById('root');
            if (!containerEl) {
                containerEl = document.body;
            }

            if (containerEl) {
                containerEl.innerHTML = layoutHtml;

                pipe(
                    query('#content-placeholder'),
                    Maybe.map(el => el.innerHTML = pageContent)
                );
                
                const uiResults = await setupUI(basePath);
                return Result.Ok(uiResults);
            } else {
                const error = new Error('CRITICAL: No container element found (#root or body).');
                console.error(error.message);
                return Result.Error(error);
            }
        };

        main().then(result => {
            if (result.type === 'Error') {
                console.error('Application initialization failed:', result.error);
            } else {
                console.log('Application initialized successfully');
            }
        }).catch(console.error);
    };
    
    try {
        init();
    } catch (e) {
        console.error("A critical error occurred during site initialization:", e);
    }
});
