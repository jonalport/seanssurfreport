window.loadCommunityContent = function (main) {
  main.innerHTML = `
        <iframe 
            src="https://community.seanssurfreport.com" 
            style="width: 100%; border: none; overflow: hidden;" 
            title="Sean's Surf Report Community"
            scrolling="no"
        ></iframe>
    `;

  // Get the iframe
  const iframe = main.querySelector("iframe");
  let heightTimeout;
  function setIframeHeight(height) {
    clearTimeout(heightTimeout);
    heightTimeout = setTimeout(() => {
      console.log("Setting iframe height:", height);
      iframe.style.height = `${height}px`;
    }, 100); // Debounce 100ms
  }

  // Listen for postMessage from Discourse
  window.addEventListener("message", (event) => {
    if (event.origin !== "https://community.seanssurfreport.com") return; // Security check
    if (event.data.type === "iframeHeight") {
      setIframeHeight(event.data.height);
    }
  });

  // Fallback height if no postMessage is received
  setTimeout(() => {
    if (!iframe.style.height || iframe.style.height === "500px") {
      console.warn("No postMessage received, applying fallback height");
      iframe.style.height = "2000px";
    }
  }, 5000); // Wait 5 seconds

  // Request height on window resize
  window.addEventListener("resize", () => {
    try {
      iframe.contentWindow.postMessage(
        { type: "requestHeight" },
        "https://community.seanssurfreport.com"
      );
    } catch (e) {
      console.error("Cannot request height:", e);
      setIframeHeight(2000); // Fallback
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
  window.removeEventListener("message", setIframeHeight);
  window.removeEventListener("resize", setIframeHeight);

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
