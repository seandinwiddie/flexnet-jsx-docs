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
        return fetch('/templates/layout.html')
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
            loadComponent('sidebar-placeholder', '/templates/sidebar.html'),
            loadComponent('header-placeholder', '/templates/header.html'),
            loadComponent('footer-placeholder', '/templates/footer.html')
        ]).then(() => {
            console.log('All components loaded.');
            
            // Re-run highlight.js after content is loaded
            if (window.hljs) {
                hljs.highlightAll();
            }

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
                let html = '<a href="/" class="text-gray-600 hover:underline">Home</a>';
                let cumulativePath = '';
                pathSegments.forEach((seg, idx) => {
                    cumulativePath += '/' + seg;
                    const name = seg.replace('.html', '').replace(/-/g, ' ');
                    const displayName = name.charAt(0).toUpperCase() + name.slice(1);
                    html += ' <span class="mx-2">/</span> ';
                    if (idx === pathSegments.length - 1) {
                        html += `<span>${displayName}</span>`;
                    } else {
                        html += `<a href="${cumulativePath}" class="text-gray-600 hover:underline">${displayName}</a>`;
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
