document.addEventListener('DOMContentLoaded', () => {
    // Find the page-specific content
    const pageContentElement = document.getElementById('page-content');
    if (!pageContentElement) {
        console.error('Page content container (#page-content) not found.');
        return;
    }
    const pageContent = pageContentElement.innerHTML;
    document.body.innerHTML = ''; // Clear the body

    const loadLayout = () => {
        return fetch(`${BASE_PATH}/templates/layout.html`)
            .then(response => {
                if (!response.ok) throw new Error('Layout template not found');
                return response.text();
            })
            .then(html => {
                document.body.innerHTML = html;
                const contentPlaceholder = document.getElementById('content-placeholder');
                if (contentPlaceholder) {
                    contentPlaceholder.innerHTML = pageContent;
                }
            });
    };

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

    loadLayout().then(() => {
        Promise.all([
            loadComponent('sidebar-placeholder', `${BASE_PATH}/templates/sidebar.html`),
            loadComponent('header-placeholder', `${BASE_PATH}/templates/header.html`),
            loadComponent('footer-placeholder', `${BASE_PATH}/templates/footer.html`)
        ]).then(() => {
            console.log('All components loaded.');
            
            // Re-run highlight.js after content is loaded
            if (window.hljs) {
                hljs.highlightAll();
            }

            // Theme Switcher Logic
            const themeToggleButton = document.getElementById('theme-toggle');
            if(themeToggleButton) {
                themeToggleButton.addEventListener('click', function() {
                  const html = document.documentElement;
                  html.classList.toggle('dark');
                  
                  if (html.classList.contains('dark')) {
                    localStorage.setItem('theme', 'dark');
                  } else {
                    localStorage.setItem('theme', 'light');
                  }
                });
            }

            // Sidebar Accordion
            const sidebarNav = document.querySelector('#sidebar-placeholder nav');
            if (sidebarNav) {
                const sections = [];
                sidebarNav.querySelectorAll('h3').forEach(h3 => {
                    // Find a 'ul' that is a sibling of h3, but not necessarily the direct next one.
                    let potentialUl = h3.nextElementSibling;
                    while(potentialUl && potentialUl.tagName !== 'UL') {
                        potentialUl = potentialUl.nextElementSibling;
                    }
                    
                    if (potentialUl) {
                        sections.push({ header: h3, content: potentialUl });
                    }
                });

                let activeSection = null;
                const currentPath = window.location.pathname;

                sections.forEach(section => {
                    const links = section.content.querySelectorAll('a');
                    let isGroupActive = false;
                    links.forEach(link => {
                        const linkHref = link.getAttribute('href');
                        // Exact match or if the current path is a sub-path of the link
                        if (currentPath === linkHref || (linkHref.endsWith('/') && currentPath.startsWith(linkHref))) {
                            isGroupActive = true;
                        }
                    });

                    const headerLink = section.header.querySelector('a');
                    if(headerLink) {
                        const linkHref = headerLink.getAttribute('href');
                        if (currentPath === linkHref || (linkHref.endsWith('/') && currentPath.startsWith(linkHref))) {
                            isGroupActive = true;
                        }
                    }

                    if (isGroupActive) {
                        activeSection = section;
                    }
                });

                sections.forEach(section => {
                    section.header.style.cursor = 'pointer';
                    const parentLi = section.header.closest('li');
                    const isNested = parentLi && parentLi.closest('ul');

                    if (section !== activeSection) {
                        section.content.classList.add('hidden');
                    } else {
                        // if active section is nested, make sure its parent is also open
                        if (isNested) {
                            const parentUl = section.header.closest('ul:not(.hidden)');
                            if (parentUl) {
                                // This means the parent is already supposed to be open.
                            }
                        }
                    }
                     // Ensure parent of active section is open
                    if (activeSection && section.content.contains(activeSection.header)) {
                        section.content.classList.remove('hidden');
                    }


                    section.header.addEventListener('click', (e) => {
                        if (e.target.tagName !== 'A') {
                            e.preventDefault();
                        }
                        
                        const isHidden = section.content.classList.contains('hidden');

                        // This is a simple toggle, not an accordion. To make it an accordion:
                        sections.forEach(s => {
                            if (s !== section) {
                                // do not close parent of a nested section when toggling child
                                if (!s.content.contains(section.header)) {
                                    s.content.classList.add('hidden');
                                }
                            }
                        });
                        
                        section.content.classList.toggle('hidden');
                    });
                });
                
                // Ensure parent of active section is open
                if (activeSection) {
                    activeSection.content.classList.remove('hidden');
                    const parentUl = activeSection.header.closest('ul');
                    if(parentUl) {
                       const parentSection = sections.find(s => s.content === parentUl);
                       if(parentSection) {
                           parentSection.content.classList.remove('hidden');
                       }
                    }
                }
            }

            // Initialize any scripts that depend on the loaded content here
            // For example, activating sidebar links
            const currentPath = window.location.pathname;
            const sidebarLinks = document.querySelectorAll('#sidebar-placeholder a');
            sidebarLinks.forEach(link => {
                // Check if the link's href is a substring of the current path
                if (currentPath.endsWith(link.getAttribute('href'))) {
                    link.classList.add('bg-blue-500', 'text-white');
                    link.classList.remove('dark:text-gray-300'); // Ensure active link text is white
                }
            });

            const sidebar = document.getElementById('sidebar-placeholder');
            const sidebarToggle = document.getElementById('sidebar-toggle');
            const sidebarOverlay = document.getElementById('sidebar-overlay');

            if (sidebarToggle) {
                sidebarToggle.addEventListener('click', () => {
                    sidebar.classList.remove('-translate-x-full');
                    sidebar.classList.add('translate-x-0');
                    sidebarOverlay.classList.remove('hidden');
                });
            }

            if (sidebarOverlay) {
                sidebarOverlay.addEventListener('click', () => {
                    sidebar.classList.remove('translate-x-0');
                    sidebar.classList.add('-translate-x-full');
                    sidebarOverlay.classList.add('hidden');
                });
            }

            // Breadcrumbs generation
            const breadcrumbsContainer = document.getElementById('breadcrumbs');
            if (breadcrumbsContainer) {
                const pathSegments = window.location.pathname.split('/').filter(Boolean);
                let html = '<a href="/" class="text-gray-600 dark:text-gray-400 hover:underline">Home</a>';
                let cumulativePath = '';
                pathSegments.forEach((seg, idx) => {
                    cumulativePath += '/' + seg;
                    const name = seg.replace('.html', '').replace(/-/g, ' ');
                    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
                    html += ' <span class="mx-2 text-gray-500 dark:text-gray-400">/</span> ';
                    if (idx === pathSegments.length - 1) {
                         html += `<span class="text-gray-800 dark:text-gray-200">${displayName}</span>`;
                    } else {
                        html += `<a href="${cumulativePath}" class="text-gray-600 dark:text-gray-400 hover:underline">${displayName}</a>`;
                    }
                });
                breadcrumbsContainer.innerHTML = html;
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
