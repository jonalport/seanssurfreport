window.loadCommunityContent = function(main) {
    main.innerHTML = `
        <iframe 
            src="https://community.seanssurfreport.com" 
            style="width: 100%; height: 100%; border: none; overflow: hidden;" 
            title="Sean's Surf Report Community"
            scrolling="no"
        ></iframe>
    `;

    // Hide the site-footer
    const footer = document.querySelector('site-footer');
    if (footer) {
        footer.style.display = 'none';
    }

    // Add styles (only once, if not already added)
    if (!document.querySelector('style#site-community-styles')) {
        const style = document.createElement('style');
        style.id = 'site-community-styles';
        style.textContent = `
            html, body {
                height: 100%;
                margin: 0;
                padding: 0;
                overflow: auto; /* Ensure main page handles scrolling */
            }
            site-main {
                width: 100%;
                height: 100vh; /* Full viewport height */
                margin: 0;
                padding: 0;
                overflow: auto; /* Scrollbar on the main container */
                box-sizing: border-box;
            }
            iframe {
                display: block;
                width: 100%;
                height: 100%;
                overflow: hidden !important; /* Force disable iframe scrollbars */
                border: none;
                margin: 0 auto;
            }
        `;
        document.head.appendChild(style);
    }
};

// Cleanup function to remove community-specific styles and restore footer
window.unloadCommunityContent = function() {
    const communityStyles = document.getElementById('site-community-styles');
    if (communityStyles) communityStyles.remove();

    // Restore the site-footer
    const footer = document.querySelector('site-footer');
    if (footer) {
        footer.style.display = '';
    }
};