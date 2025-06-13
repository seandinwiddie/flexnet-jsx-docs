# Refactoring a Multi-Page Site for Shared Assets and Templating

This guide provides a step-by-step process for refactoring a traditional multi-page static website (like the one in the `docs` directory) to use shared CSS and JavaScript files, and to dynamically load common elements like headers, footers, and sidebars from template files.

This approach maintains the simplicity of individual HTML files for each page while reducing code duplication and centralizing control over common assets.

## Step 1: Set Up the Project Structure

Organize your project to keep your content structure intact while creating dedicated folders for shared assets and templates at the project's root.

```text
.
├── index.html
├── getting-started-guide.html
├── security-practices.html
├── ...
├── assets/
│   ├── main.js
│   └── main.css
├── templates/
│   ├── header.html
│   ├── sidebar.html
│   └── footer.html
└── */
    ├── *.html
    └── ...
```

- **`/` (root)**: This directory is the root of your website. `index.html` and other top-level pages live here.
- **`assets/`**: Contains your shared, site-wide CSS and JavaScript.
- **`templates/`**: Contains the HTML snippets for reusable parts of your site.
- **`*/` (and other subdirectories)**: Your original content subdirectories remain in place, holding their respective HTML files.

## Step 2: Extract Reusable HTML into Template Files

Identify the common, repeating sections of your website. Typically, these are the header, footer, and a navigation sidebar.

1.  **Create the template files**: Create `header.html`, `sidebar.html`, and `footer.html` inside the `templates/` directory.
2.  **Copy the HTML**: Cut the corresponding HTML content from one of your existing pages (e.g., `docs/index.html`) and paste it into these new files. For example, the `header.html` would contain your site's main `<h1>` and `<nav>`.
3.  **Create Placeholders**: In your main HTML files (`index.html`, `guides/guide-one.html`, etc.), replace the HTML you just cut out with empty placeholder elements. These will be populated by your `main.js` script.

**Example: `index.html` after modification:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Website - Home</title>
    <link rel="stylesheet" href="/assets/main.css">
</head>
<body>
    <header id="header-placeholder"></header>

    <div class="main-content">
        <aside id="sidebar-placeholder"></aside>
        <main>
            <h1>Welcome to the Home Page</h1>
            <p>This is the unique content for the home page.</p>
        </main>
    </div>

    <footer id="footer-placeholder"></footer>

    <script src="/assets/main.js"></script>
</body>
</html>
```
**Important**: You must repeat this process for **all** of your content HTML pages, both at the root and in any subdirectories, replacing their specific headers, footers, and sidebars with these same placeholder elements.

## Step 3: Consolidate Styles into `main.css`

Gather all the CSS from your existing website. This may involve extracting styles from `<style>` tags within your HTML files or combining multiple `.css` files.

1.  Place all the consolidated CSS rules into the `assets/main.css` file.
2.  Remove all `<style>` blocks and links to other stylesheets from your `.html` files to ensure they only use the single, shared stylesheet.

## Step 4: Link Shared Assets in All HTML Files

Ensure every single `.html` file in your project correctly links to the shared `main.css` and `main.js` using **root-relative paths** (paths that start with a `/`).

Using root-relative paths is crucial because it ensures that the links work correctly whether the HTML file is at the root (`index.html`) or in a subdirectory (`guides/guide-one.html`).

In each `.html` file:
1.  Add this line in the `<head>` section:
    ```html
    <link rel="stylesheet" href="/assets/main.css">
    ```
2.  Add this line just before the closing `</body>` tag:
    ```html
    <script src="/assets/main.js"></script>
    ```

## Step 5: Implement the Dynamic Template Loader in `main.js`

This script is the key to the templating system. It runs on every page load, fetches the HTML for your reusable parts, and injects them into the placeholder elements.

**`assets/main.js`:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const loadTemplate = async (id, url) => {
        const placeholder = document.getElementById(id);
        if (!placeholder) {
            // It's okay if a placeholder doesn't exist on every single page.
            return;
        }
        try {
            // Use root-relative paths for reliable fetching
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
            }
            const html = await response.text();
            placeholder.innerHTML = html;
        } catch (error) {
            console.error(`Error loading template for #${id}:`, error);
            placeholder.innerHTML = `<p style="color: red; text-align: center;">Error loading content.</p>`;
        }
    };

    // Load all templates concurrently.
    // These paths are relative to the public root.
    Promise.all([
        loadTemplate('header-placeholder', '/templates/header.html'),
        loadTemplate('sidebar-placeholder', '/templates/sidebar.html'),
        loadTemplate('footer-placeholder', '/templates/footer.html')
    ]);
});
```

## Conclusion

By following these steps, you have successfully refactored a multi-page static site to use a centralized system for assets and common UI elements. This approach offers several advantages:

1.  **Maintainability**: Headers, footers, and styles are managed in single files, making updates easy.
2.  **Simplicity**: You retain individual HTML files, which are easy to understand, manage, and are naturally SEO-friendly.
3.  **Efficiency**: Browser caching can be leveraged effectively for the shared CSS and JS files.

This method provides many of the benefits of a static site generator without requiring a complex build step, relying only on a small, client-side JavaScript loader. 