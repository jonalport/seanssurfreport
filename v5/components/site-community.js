window.loadCommunityContent = function (main) {
  main.innerHTML = `
        <iframe 
            src="https://community.seanssurfreport.com" 
            style="width: 100%; border: none; overflow: hidden;" 
            title="Sean's Surf Report Community"
            scrolling="no"
        ></iframe>
    `;

  const iframe = main.querySelector("iframe");
  let heightTimeout;
  let lastHeight = 0;
  const maxHeight = 3200;

  function setIframeHeight(height) {
    if (Math.abs(height - lastHeight) < 30 || height > maxHeight) return;
    clearTimeout(heightTimeout);
    heightTimeout = setTimeout(() => {
      console.log("Setting iframe height:", height);
      iframe.style.height = `${height}px`;
      lastHeight = height;
    }, 100);
  }

  const messageHandler = (event) => {
    if (event.origin !== "https://community.seanssurfreport.com") return;
    if (event.data.type === "iframeHeight") {
      setIframeHeight(event.data.height);
    }
  };

  const resizeHandler = () => {
    try {
      iframe.contentWindow.postMessage(
        { type: "requestHeight" },
        "https://community.seanssurfreport.com"
      );
    } catch (e) {
      console.error("Cannot request height:", e);
      setIframeHeight(2000);
    }
  };

  window.addEventListener("message", messageHandler);
  window.addEventListener("resize", resizeHandler);

  setTimeout(() => {
    if (!iframe.style.height || iframe.style.height === "500px") {
      console.warn("No postMessage received, applying fallback height");
      setIframeHeight(2000);
    }
  }, 5000);

  window.setSectionVisibility('community');

  if (!document.querySelector("style#site-community-styles")) {
    const style = document.createElement("style");
    style.id = "site-community-styles";
    style.textContent = `
            html, body {
                height: auto;
                min-height: 100%;
                margin: 0;
                padding: 0;
                overflow-y: auto;
                overflow-x: hidden;
            }
            site-main {
                width: 100%;
                min-height: 100vh;
                height: auto;
                margin: 0;
                padding: 0;
                overflow: visible;
                box-sizing: border-box;
            }
            iframe {
                display: block;
                width: 100%;
                overflow: hidden !important;
                border: none;
                margin: 0 auto;
                min-height: 500px;
            }
            site-footer, site-feed, site-nav {
                display: none !important;
            }
        `;
    document.head.appendChild(style);
  }

  window.loadCommunityContent.messageHandler = messageHandler;
  window.loadCommunityContent.resizeHandler = resizeHandler;
};

window.unloadCommunityContent = function () {
  const communityStyles = document.getElementById("site-community-styles");
  if (communityStyles) communityStyles.remove();

  if (window.loadCommunityContent.messageHandler) {
    window.removeEventListener(
      "message",
      window.loadCommunityContent.messageHandler
    );
  }
  if (window.loadCommunityContent.resizeHandler) {
    window.removeEventListener(
      "resize",
      window.loadCommunityContent.resizeHandler
    );
  }

  delete window.loadCommunityContent.messageHandler;
  delete window.loadCommunityContent.resizeHandler;
};