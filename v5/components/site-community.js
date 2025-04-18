window.loadCommunityContent = function(main) {
    main.innerHTML = `
        <iframe 
            src="https://community.seanssurfreport.com" 
            style="width: 100%; border: none; overflow: hidden;" 
            title="Sean's Surf Report Community"
            scrolling="no"
        ></iframe>
    `;

    // Get the iframe and dynamically set its height
    const iframe = main.querySelector('iframe');
    function resizeIframe() {
        try {
            // Attempt to access iframe content height (works if same-origin)
            const contentHeight = iframe.contentWindow?.document.body.scrollHeight;
            if (contentHeight) {
                iframe.style.height = `${contentHeight}px`;
            } else {
                // Fallback for cross-origin or if content height is unavailable
                iframe.style.height = '2000px'; // Arbitrary large height, adjust as needed
            }
        } catch (e) {
            // Cross-origin error fallback
            iframe.style.height = '2000px'; // Arbitrary large height, adjust as needed
        }
    }

    // Initial resize
    iframe.addEventListener('load', resizeIframe);
    // Resize on window change (optional, for responsiveness)
    window.addEventListener('resize', resizeIframe);

    // Hide the site-footer
    const footer = document.querySelector('site-footer');
    if (footer) {
        footer.style.display = 'none';
        const shadowFooter = footer.shadowRoot?.querySelector('footer');
        if (shadowFooter) {
            shadowFooter