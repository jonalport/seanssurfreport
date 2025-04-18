window.loadCommunityContent = function(main) {
    main.innerHTML = `
        <iframe 
            src="https://community.seanssurfreport.com" 
            style="width: 100%; height: 1200px; border: none;" 
            title="Sean's Surf Report Community"
        ></iframe>
    `;

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

// Cleanup function to remove community-specific styles
window.unloadCommunityContent = function() {
    const communityStyles = document.getElementById('site-community-styles');
    if (communityStyles) communityStyles.remove();
};