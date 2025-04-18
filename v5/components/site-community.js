window.loadCommunityContent = function(main) {
    main.innerHTML = `
        <iframe 
            src="https://community.seanssurfreport.com" 
            style="width: 100%; border: none; overflow: hidden;" 
            title="Sean's Surf Report Community"
            scrolling="no"
        ></iframe>
    `;

    // Get the iframe and set its height dynamically
    const iframe = main.querySelector('iframe');
    function resizeIframe() {
        // Attempt to access the iframe's content height
        try {
            const contentHeight = iframe.contentWindow.document.body.scrollHeight;
            iframe.style.height = `${contentHeight}px`;
        } catch (e) {
            console.error('Cannot access iframe content height:', e);
            // Fallback to a reasonable height if cross-origin restrictions apply
            iframe.style.height = '1000px'; // Adjust as needed
        }
    }

    // Initial resize after iframe loads
    iframe.addEventListener('load', resizeIframe);

    // Resize on window resize to handle dynamic content
    window.addEventListener('resize', resizeIframe);

    // Hide the site-footer
    const footer = document.querySelector('site-footer');
    if (footer) {
        footer.style.display = 'none';
        const shadowFooter = footer.shadowRoot?.querySelector('footer');
        if (shadowFooter) {
            shadowFooter.style.display = 'none';
        }
    }

    // Add styles (only once, if not already added)
    if (!document.querySelector('style#site-community-styles')) {
        const style = document.createElement('style');
        style.id = 'site-community-styles';
        style.textContent = `
            html, body {
                height: auto;
                min-height: 100%;
                margin: 0;
                padding: 0;
                overflow: auto; /* Main page handles scrolling */
            }
            site-main {
                width: 100%;
                min-height: 100vh; /* Minimum height, but can grow */
                margin: 0;
                padding: 0;
                overflow: visible; /* Allow site-main to expand */
                box-sizing: border-box;
            }
            iframe {
                display: block;
                width: 100%;
                overflow: hidden !important; /* No iframe scrollbars */
                border: none;
                margin: 0 auto;
            }
            site-footer {
                display: none !important; /* Ensure footer is hidden */
            }
        `;
        document.head.appendChild(style);
    }
};

// Cleanup function to remove community-specific styles and restore footer
window.unloadCommunityContent = function() {
    const communityStyles = document.getElementById('site-community-styles');
    if (communityStyles) communityStyles.remove();

    // Remove resize event listener
    window.removeEventListener('resize', resizeIframe);

    // Restore the site-footer
    const footer = document.querySelector('site-footer');
    if (footer) {
        footer.style.display = '';
        const shadowFooter = footer.shadowRoot?.querySelector('footer');
        if (shadowFooter) {
            shadowFooter.style.display = '';
        }
    }
};