// === Single File Architecture for FlexNet JSX Docs ===

document.addEventListener('DOMContentLoaded', () => {
    // This file combines logic from main.js and base-path.js, and refactors it
    // according to the principles in the project's markdown documentation.

    const init = () => {
        // --- Core Types (from api-reference.md, adapted for fluent API) ---
        const Maybe = {
            Just: value => ({
                map: fn => Maybe.Just(fn(value)),
                chain: fn => fn(value),
                getOrElse: () => value,
            }),
            Nothing: () => ({
                map: () => Maybe.Nothing(),
                chain: () => Maybe.Nothing(),
                getOrElse: defaultValue => defaultValue,
            }),
            fromNullable: value => (value !== null && value !== undefined) ? Maybe.Just(value) : Maybe.Nothing(),
        };

        const Result = {
            Ok: value => ({
                map: fn => Result.Ok(fn(value)),
                chain: fn => fn(value),
                fold: (_, successFn) => successFn(value),
                isOk: true,
            }),
            Error: error => ({
                map: () => Result.Error(error),
                chain: () => Result.Error(error),
                fold: (errorFn, _) => errorFn(error),
                isOk: false,
            }),
            fromTry: fn => {
                try {
                    return Result.Ok(fn());
                } catch (e) {
                    return Result.Error(e);
                }
            },
        };

        // --- Core Functions (from api-reference.md) ---
        const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x);
        const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);

        // --- Security Functions (from security-practices.md) ---
        const escapeHTML = str => compose(
            String,
            s => s.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&#039;')
        )(str);

        // --- Application-specific Pure Functions ---
        const getBasePath = () => {
            const hostname = window.location.hostname;
            if (hostname.includes('github.io')) {
                const path = window.location.pathname.split('/')[1];
                return `/${path}`;
            }
            return '';
        };

        // --- Effectful Functions (Side Effects Wrapper) ---
        const query = selector => Maybe.fromNullable(document.querySelector(selector));
        const queryAll = selector => Array.from(document.querySelectorAll(selector));
        const setHtml = html => element => Maybe.fromNullable(element).map(el => {
            el.innerHTML = html;
            return el;
        });
        const addListener = event => handler => element => {
            element.addEventListener(event, handler);
            return element;
        };
        const fetchResource = async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) return Result.Error(new Error(`Request failed for ${url}: ${response.statusText}`));
                return Result.Ok(await response.text());
            } catch (e) {
                return Result.Error(e);
            }
        };
        
        // --- UI Initialization Functions ---
        const loadComponent = async (placeholderId, url) => {
            const result = await fetchResource(url);
            result.fold(
                error => console.warn(`Error loading component ${url}:`, error),
                html => Maybe.fromNullable(document.querySelector(`#${placeholderId}`)).map(el => el.innerHTML = html)
            );
        };

        const setupLogo = (basePath) => {
            query('#logo-image').map(img => {
                img.src = `${basePath}/flexnet.png`;
            });
        };

        const setupSyntaxHighlighting = () => {
            if (window.hljs) {
                window.hljs.highlightAll();
            }
        };
        
        const setupThemeSwitcher = () => {
            query('#theme-toggle').map(addListener('click')(() => {
                const html = document.documentElement;
                html.classList.toggle('dark');
                localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
            }));
        };

        const setupSidebarAccordion = () => {
            query('#sidebar-placeholder nav').map(sidebarNav => {
                const sections = queryAll('h3', sidebarNav)
                    .map(h3 => ({ header: h3, content: h3.nextElementSibling }))
                    .filter(section => section.content && section.content.tagName === 'UL');
        
                const currentPath = window.location.pathname;
        
                const getActiveSection = () => {
                    for (const section of sections) {
                        const links = Array.from(section.content.querySelectorAll('a'));
                        links.push(section.header.querySelector('a'));
        
                        if (links.some(link => link && currentPath.endsWith(link.getAttribute('href')))) {
                             return section;
                        }
                    }
                    return null;
                };
        
                const activeSection = getActiveSection();
        
                sections.forEach(section => {
                    const isSectionActive = section === activeSection;
                    const contentIsHidden = !isSectionActive;
                    section.content.classList.toggle('hidden', contentIsHidden);
        
                    section.header.style.cursor = 'pointer';
                    addListener('click')(e => {
                        if (e.target.tagName !== 'A') e.preventDefault();
                        
                        const isHidden = section.content.classList.contains('hidden');
                        if(isHidden) { // If it's hidden, we want to show it and hide others
                            sections.forEach(s => {
                                if (s !== section) {
                                    s.content.classList.add('hidden');
                                }
                            });
                            section.content.classList.remove('hidden');
                        } else { // If it's visible, just hide it
                            section.content.classList.add('hidden');
                        }
                    })(section.header);
                });
            });
        };

        const setupSidebarActiveLink = () => {
            const currentPath = window.location.pathname;
            queryAll('#sidebar-placeholder a').forEach(link => {
                if (currentPath.endsWith(link.getAttribute('href'))) {
                    link.classList.add('bg-blue-500', 'text-white');
                    link.classList.remove('dark:text-gray-300');
                }
            });
        };

        const setupMobileSidebar = () => {
            const sidebar = query('#sidebar-placeholder');
            const overlay = query('#sidebar-overlay');
        
            const closeSidebar = () => {
                sidebar.map(s => s.classList.add('-translate-x-full'));
                overlay.map(o => o.classList.add('hidden'));
            };
        
            const openSidebar = () => {
                sidebar.map(s => s.classList.remove('-translate-x-full'));
                overlay.map(o => o.classList.remove('hidden'));
            };
        
            query('#sidebar-toggle').map(addListener('click')(openSidebar));
            overlay.map(addListener('click')(closeSidebar));
        };

        const setupBreadcrumbs = () => {
            query('#breadcrumbs').map(container => {
                const pathSegments = window.location.pathname.split('/').filter(Boolean);
                const homeLink = `<a href="/" class="text-gray-600 dark:text-gray-400 hover:underline">Home</a>`;
                
                const breadcrumbLinks = pathSegments.map((seg, idx) => {
                    const cumulativePath = `/${pathSegments.slice(0, idx + 1).join('/')}`;
                    const name = seg.replace('.html', '').replace(/-/g, ' ');
                    const displayName = escapeHTML(name.charAt(0).toUpperCase() + name.slice(1));
        
                    if (idx === pathSegments.length - 1) {
                        return `<span class="text-gray-800 dark:text-gray-200">${displayName}</span>`;
                    }
                    return `<a href="${cumulativePath}" class="text-gray-600 dark:text-gray-400 hover:underline">${displayName}</a>`;
                });
        
                container.innerHTML = [homeLink, ...breadcrumbLinks].join(' <span class="mx-2 text-gray-500 dark:text-gray-400">/</span> ');
            });
        };
        
        const setupCopyButtons = () => {
            queryAll('pre').forEach(pre => {
                const parent = pre.parentElement;
                const button = parent ? parent.querySelector('button') : null;
                if (button) {
                    addListener('click')(() => {
                        navigator.clipboard.writeText(pre.innerText).then(() => {
                            button.innerText = 'Copied!';
                            setTimeout(() => { button.innerText = 'Copy'; }, 2000);
                        });
                    })(button);
                }
            });
        };

        // --- Main Application Logic ---
        const main = async () => {
            const pageContent = query('#page-content').map(el => el.innerHTML).getOrElse('');
            document.body.innerHTML = '';
            
            const basePath = getBasePath();
            const layoutResult = await fetchResource(`${basePath}/templates/layout.html`);

            layoutResult.fold(
                error => console.error("Failed to load layout:", error),
                async (layoutHtml) => {
                    document.body.innerHTML = layoutHtml;
                    Maybe.fromNullable(document.querySelector('#content-placeholder')).map(el => el.innerHTML = pageContent);

                    await Promise.all([
                        loadComponent('sidebar-placeholder', `${basePath}/templates/sidebar.html`),
                        loadComponent('header-placeholder', `${basePath}/templates/header.html`),
                        loadComponent('footer-placeholder', `${basePath}/templates/footer.html`)
                    ]);
                    
                    // Initialize all UI components after the main layout and components are loaded.
                    setupLogo(basePath);
                    setupSyntaxHighlighting();
                    setupThemeSwitcher();
                    setupSidebarAccordion();
                    setupSidebarActiveLink();
                    setupMobileSidebar();
                    setupBreadcrumbs();
                    setupCopyButtons();
                }
            );
        };

        main().catch(console.error);
    };
    
    init();
});
