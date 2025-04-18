window.loadCommunityContent = function(main) {
    main.innerHTML = `
        <iframe 
            src="https://community.seanssurfreport.com" 
            style="width: 100%; height: 100%; border: none;" 
            title="Sean's Surf Report Community"
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
            iframe {
                display: block;
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