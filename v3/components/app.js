// Page content
const pages = {
    '/': "<h2>Welcome</h2><p>Select a beach from the dashboard below.</p>",
    '/beach1': "<h2>Beach 1 Report</h2><p>Waves: 3-5 ft, Wind: Light offshore</p>",
    '/beach2': "<h2>Beach 2 Report</h2><p>Waves: 2-3 ft, Wind: Strong onshore</p>",
    '/beach3': "<h2>Beach 3 Report</h2><p>Waves: 4-6 ft, Wind: Calm</p>"
};

// Select elements
const contentDiv = document.getElementById('content');
const links = document.querySelectorAll('.card');

// Function to render content based on URL
function renderPage() {
    let path = window.location.pathname;
    if (path.startsWith('/test.html')) {
        path = path.replace('/test.html', '') || '/';
    }
    contentDiv.innerHTML = pages[path] || "<p>No report available for this path: " + path + "</p>";
}

// Wait for the custom element to load
function initializeApp() {
    const header = document.querySelector('site-header');
    if (!header || !header.shadowRoot) {
        console.error("Header not loaded yet. Retrying...");
        setTimeout(initializeApp, 100);
        return;
    }

    // Handle dashboard link clicks
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            window.history.pushState({}, '', href);
            renderPage();
        });
    });

    // Handle header logo click (inside Shadow DOM)
    const logoLink = header.shadowRoot.querySelector('.logo-link');
    if (logoLink) {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.history.pushState({}, '', '/');
            renderPage();
        });
    } else {
        console.error("Logo link not found in header shadow DOM");
    }

    // Handle back/forward browser navigation
    window.addEventListener('popstate', renderPage);

    // Initial render
    renderPage();
}

// Start the app
document.addEventListener('DOMContentLoaded', initializeApp);