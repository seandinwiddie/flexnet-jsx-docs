/**
 * FlexNet Documentation JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize code highlighting if available
  if (window.hljs) {
    hljs.highlightAll();
  }

  // Set active navigation based on current page
  initializeNavigation();

  // Initialize search functionality
  initializeSearch();

  // Add mobile menu toggle
  initializeMobileMenu();

  // Initialize code copy buttons
  addCodeCopyButtons();
});

/**
 * Sets active state in navigation based on current URL
 */
function initializeNavigation() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-menu a');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('href');
    
    // Check if the current path ends with the link path or if they're equal
    if (currentPath.endsWith(linkPath) || (currentPath === '/' && linkPath === 'index.html')) {
      link.classList.add('active');
      
      // Expand parent sections if in mobile view
      const parentSection = link.closest('.nav-section');
      if (parentSection) {
        parentSection.classList.add('expanded');
      }
    }
  });
}

/**
 * Basic search functionality
 */
function initializeSearch() {
  const searchInput = document.querySelector('.search-container input');
  if (!searchInput) return;

  // This is a placeholder for actual search functionality
  // In a real implementation, you would:
  // 1. Index all documentation content
  // 2. Implement search algorithms
  // 3. Show/hide a dropdown with results
  
  searchInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const searchValue = searchInput.value.trim().toLowerCase();
      if (searchValue.length < 2) return;
      
      // For demonstration, we'll just redirect to a search results page
      // In a real implementation, you would show results dynamically
      console.log(`Searching for: ${searchValue}`);
      // Uncomment and modify this when you have a search page implemented
      // window.location.href = `/docs/search.html?q=${encodeURIComponent(searchValue)}`;
    }
  });
}

/**
 * Mobile menu toggle functionality
 */
function initializeMobileMenu() {
  // Add a mobile menu toggle button to the DOM
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');
  
  if (!sidebar || !content) return;
  
  const toggleButton = document.createElement('button');
  toggleButton.classList.add('mobile-menu-toggle');
  toggleButton.innerHTML = '<span class="menu-icon">☰</span>';
  toggleButton.setAttribute('aria-label', 'Toggle menu');
  
  // Insert the button at the beginning of the content header
  const contentHeader = document.querySelector('.content-header');
  if (contentHeader) {
    contentHeader.insertBefore(toggleButton, contentHeader.firstChild);
  }
  
  // Toggle sidebar visibility on button click
  toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('visible');
    toggleButton.classList.toggle('active');
  });
  
  // Close sidebar when clicking outside of it on mobile
  document.addEventListener('click', (event) => {
    const isMobile = window.innerWidth <= 768;
    const isClickInsideSidebar = sidebar.contains(event.target);
    const isClickOnToggleButton = toggleButton.contains(event.target);
    
    if (isMobile && !isClickInsideSidebar && !isClickOnToggleButton && sidebar.classList.contains('visible')) {
      sidebar.classList.remove('visible');
      toggleButton.classList.remove('active');
    }
  });
}

/**
 * Add copy buttons to code blocks
 */
function addCodeCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(codeBlock => {
    const container = codeBlock.parentNode;
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = 'Copy';
    
    // Position the button
    container.style.position = 'relative';
    
    // Add button to the code block container
    container.appendChild(copyButton);
    
    // Add click event
    copyButton.addEventListener('click', () => {
      const code = codeBlock.textContent;
      navigator.clipboard.writeText(code).then(() => {
        // Visual feedback
        copyButton.textContent = 'Copied!';
        setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy code: ', err);
        copyButton.textContent = 'Error';
        setTimeout(() => {
          copyButton.textContent = 'Copy';
        }, 2000);
      });
    });
  });
}

/**
 * Handle theme toggle (light/dark mode)
 * This would be expanded in a real implementation
 */
function initializeThemeToggle() {
  const themeToggle = document.createElement('button');
  themeToggle.classList.add('theme-toggle');
  themeToggle.innerHTML = '🌙'; // Default to dark mode icon
  themeToggle.setAttribute('aria-label', 'Toggle theme');
  
  // Append to header links
  const headerLinks = document.querySelector('.header-links');
  if (headerLinks) {
    headerLinks.appendChild(themeToggle);
  }
  
  // Theme toggle functionality
  themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark-theme');
    
    // Update icon
    if (document.documentElement.classList.contains('dark-theme')) {
      themeToggle.innerHTML = '☀️';
    } else {
      themeToggle.innerHTML = '🌙';
    }
    
    // Save preference
    const isDarkMode = document.documentElement.classList.contains('dark-theme');
    localStorage.setItem('flexnet-dark-mode', isDarkMode);
  });
  
  // Set initial theme based on user preference
  const savedTheme = localStorage.getItem('flexnet-dark-mode');
  if (savedTheme === 'true') {
    document.documentElement.classList.add('dark-theme');
    themeToggle.innerHTML = '☀️';
  }
}

// Additional functionality could be added here in a real implementation, such as:
// - Version selector
// - Feedback form
// - Animated examples
// - Interactive code playgrounds 