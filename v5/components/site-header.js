class SiteHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet"
                  integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" 
                  crossorigin="anonymous">
            <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" 
                  rel="stylesheet">

            <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"
                    integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe"
                    crossorigin="anonymous"></script>

            <style>
                :host {
                    display: block;
                    height: 70px;
                    width: 100%;
                    background-color: #141414;
                }

                .logo-group {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    width: auto;
                    margin: 0;
                    padding: 0;
                    gap: 20px;
                }

                .logo-site {
                    display: flex;
                    align-items: center;
                    height: 100%;
                    margin: 0;
                    padding: 0 20px 0 0;
                }

                .logo-site img {
                    height: 100%;
                    width: auto;
                    max-width: 100%;
                    object-fit: contain;
                    padding: 17px 0;
                }

                .icon-dash {
                    display: flex;
                    align-items: center;
                    height: 100%;
                    margin: 0;
                    padding: 14px 0;
                }

                .icon-dash img {
                    height: 100%;
                    width: auto;
                    max-width: 100%;
                    opacity: 65%;
                    transition: opacity .25s ease-in-out;
                    object-fit: contain;
                }

                .icon-dash img:hover {
                    opacity: 100%;
                }

                .icon-forecast {
                    display: flex;
                    align-items: center;
                    height: 100%;
                    margin: 0;
                    padding: 14px 0;
                }

                .icon-forecast img {
                    height: 100%;
                    width: auto;
                    max-width: 100%;
                    opacity: 65%;
                    transition: opacity .25s ease-in-out;
                    object-fit: contain;
                }

                .icon-forecast img:hover {
                    opacity: 100%;
                }

                .icon-community {
                    display: flex;
                    align-items: center;
                    height: 100%;
                    margin: 0;
                    padding: 14px 0;
                }

                .icon-community img {
                    height: 100%;
                    width: auto;
                    max-width: 100%;
                    opacity: 65%;
                    transition: opacity .25s ease-in-out;
                    object-fit: contain;
                }

                .icon-community img:hover {
                    opacity: 100%;
                }

                @media (max-width: 640px) {
                    .logo-group {
                        gap: 15px;
                        padding: 0 10px;
                    }

                    .logo-site {
                        padding: 20px 0;
                    }

                    .logo-site img {
                        padding: 0;
                    }

                    .icon-dash {
                        padding: 13px 0px;
                    }

                    .icon-dash img {
                        padding: 0;
                    }

                    .icon-forecast {
                        padding: 13px 0px;
                    }

                    .icon-forecast img {
                        padding: 0;
                    }

                    .icon-community {
                        padding: 13px 0px;
                    }

                    .icon-community img {
                        padding: 0;
                    }
                }
            </style>

            <div class="logo-group">
                <a class="logo-site" href="/v5/">
                    <img src="./img/logo.png" alt="Sean's surf report">
                </a>
                <a class="icon-dash" href="#dashboard">
                    <img src="./img/icon_01_dash.png" alt="Dashboard">
                </a>
                <a class="icon-forecast" href="#kbc">
                    <img src="./img/icon_02_forecast.png" alt="Forecast">
                </a>
                <a class="icon-community" href="#community">
                    <img src="./img/icon_03_community.png" alt="Community">
                </a>
            </div>
        `;

    // Add event listeners for the buttons
    this.shadowRoot
      .querySelector(".icon-dash")
      .addEventListener("click", this.handleDashClick.bind(this));
    this.shadowRoot
      .querySelector(".icon-forecast")
      .addEventListener("click", this.handleForecastClick.bind(this));
    this.shadowRoot
      .querySelector(".icon-community")
      .addEventListener("click", this.handleCommunityClick.bind(this));
  }

  // Centralized function to control section visibility
  setSectionVisibility(page) {
    const nav = document.querySelector("site-nav");
    const feed = document.querySelector("site-feed");
    const footer = document.querySelector("site-footer");
    const shadowFooter = footer?.shadowRoot?.querySelector("footer");

    switch (page) {
      case "dashboard":
        if (nav) nav.style.display = "none";
        if (feed) feed.style.display = "";
        if (footer) footer.style.display = "";
        if (shadowFooter) shadowFooter.style.display = "";
        break;
      case "forecast":
        if (nav) nav.style.display = "";
        if (feed) feed.style.display = "";
        if (footer) footer.style.display = "";
        if (shadowFooter) shadowFooter.style.display = "";
        break;
      case "community":
        if (nav) nav.style.display = "none";
        if (feed) feed.style.display = "none";
        if (footer) footer.style.display = "none";
        if (shadowFooter) shadowFooter.style.display = "none";
        break;
      default:
        console.warn(`Unknown page: ${page}, resetting to default visibility`);
        if (nav) nav.style.display = "";
        if (feed) feed.style.display = "";
        if (footer) footer.style.display = "";
        if (shadowFooter) shadowFooter.style.display = "";
    }
  }

  handleDashClick(event) {
    event.preventDefault();
    const main = document.querySelector("site-main");
    if (!main) return;

    if (typeof window.unloadCommunityContent === "function") {
      window.unloadCommunityContent();
    }

    const existingScript = document.getElementById("site-dash-script");
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.src = "components/site-dash.js";
    script.id = "site-dash-script";
    script.onload = () => {
      if (
        window.loadDashContent &&
        typeof window.loadDashContent === "function"
      ) {
        window.loadDashContent(main);
        this.setSectionVisibility('dashboard');
      } else {
        console.error("loadDashContent function not found");
      }
    };
    script.onerror = () => {
      console.error("Failed to load site-dash.js");
      main.innerHTML = "<p>Error loading dashboard</p>";
    };
    document.body.appendChild(script);
  }

  handleForecastClick(event) {
    event.preventDefault();
    const main = document.querySelector("site-main");
    const nav = document.querySelector("site-nav");
    if (!nav || !main) return;

    if (typeof window.unloadCommunityContent === "function") {
      window.unloadCommunityContent();
    }

    nav.loadPage("kbc");
    this.setSectionVisibility('forecast');
  }

  handleCommunityClick(event) {
    event.preventDefault();
    const main = document.querySelector("site-main");
    if (!main) return;

    const existingScript = document.getElementById("site-community-script");
    if (existingScript) existingScript.remove();

    const script = document.createElement("script");
    script.src = "components/site-community.js";
    script.id = "site-community-script";
    script.onload = () => {
      if (
        window.loadCommunityContent &&
        typeof window.loadCommunityContent === "function"
      ) {
        window.loadCommunityContent(main);
        this.setSectionVisibility('community');
      } else {
        console.error("loadCommunityContent function not found");
      }
    };
    script.onerror = () => {
      console.error("Failed to load site-community.js");
      main.innerHTML = "<p>Error loading community page</p>";
    };
    document.body.appendChild(script);
  }
}

customElements.define("site-header", SiteHeader);

// Expose setSectionVisibility globally
window.setSectionVisibility = function(page) {
  const header = document.querySelector("site-header");
  if (header && header.setSectionVisibility) {
    header.setSectionVisibility(page);
  } else {
    console.error("setSectionVisibility not available in site-header");
  }
};