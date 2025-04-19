window.loadCommunityContent = function (main) {
  main.innerHTML = `
        <iframe 
            src="https://community.seanssurfreport.com" 
            style="width: 100%; border: none; overflow: hidden;" 
            title="Sean's Surf Report Community"
            scrolling="no"
        ></iframe>
    `;

  // Get the iframe and set its height dynamically
  const iframe = main.querySelector("iframe");
  function resizeIframe() {
    let attempts = 0;
    const maxAttempts = 10;
    function tryResize() {
      try {
        const contentHeight = iframe.contentWindow.document.body.scrollHeight;
        console.log("Iframe content height:", contentHeight);
        if (contentHeight > 150) {
          // Avoid small default heights
          iframe.style.height = `${contentHeight}px`;
          iframe.contentWindow.document.body.style.overflow = "hidden";
        } else if (attempts < maxAttempts) {
          attempts++;
          console.log(
            `Attempt ${attempts}: Content height too small (${contentHeight}px), retrying...`
          );
          setTimeout(tryResize, 300);
        } else {
          console.warn("No valid content height after retries, using fallback");
          iframe.style.height = "2000px"; // Reduced fallback height
        }
      } catch (e) {
        console.error("Cannot access iframe content height:", e);
        iframe.style.height = "2000px"; // Fallback for cross-origin
        console.log("Applied fallback height of 2000px");
      }
    }
    tryResize();
  }

  // Initial resize after iframe loads
  iframe.addEventListener("load", resizeIframe);

  // Resize on window resize
  window.addEventListener("resize", resizeIframe);

  // Listen for postMessage from Discourse
  window.addEventListener("message", (event) => {
    if (event.origin !== "https://community.seanssurfreport.com") return; // Security check
    if (event.data.type === "iframeHeight") {
      console.log("Received postMessage height:", event.data.height);
      iframe.style.height = `${event.data.height}px`;
    }
  });

  // Hide the site-footer
  const footer = document.querySelector("site-footer");
  if (footer) {
    footer.style.display = "none";
    const shadowFooter = footer.shadowRoot?.querySelector("footer");
    if (shadowFooter) {
      shadowFooter.style.display = "none";
    }
  }

  // Add styles (only once, if not already added)
  if (!document.querySelector("style#site-community-styles")) {
    const style = document.createElement("style");
    style.id = "site-community-styles";
    style.textContent = `
            html, body {
                height: auto;
                min-height: 100%;
                margin: 0;
                padding: 0;
                overflow-y: auto; /* Main page handles vertical scrolling */
                overflow-x: hidden; /* Prevent horizontal scrollbar */
            }
            site-main {
                width: 100%;
                min-height: 100vh; /* Minimum height, can grow */
                height: auto; /* Allow expansion */
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
                min-height: 500px; /* Prevent collapsing to 150px */
            }
            site-footer {
                display: none !important; /* Ensure footer is hidden */
            }
        `;
    document.head.appendChild(style);
  }
};

// Cleanup function to remove community-specific styles and restore footer
window.unloadCommunityContent = function () {
  const communityStyles = document.getElementById("site-community-styles");
  if (communityStyles) communityStyles.remove();

  // Remove event listeners
  window.removeEventListener("resize", resizeIframe);
  window.removeEventListener("message", resizeIframe);

  // Restore the site-footer
  const footer = document.querySelector("site-footer");
  if (footer) {
    footer.style.display = "";
    const shadowFooter = footer.shadowRoot?.querySelector("footer");
    if (shadowFooter) {
      shadowFooter.style.display = "";
    }
  }
};
