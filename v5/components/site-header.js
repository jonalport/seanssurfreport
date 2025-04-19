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
                <a class="logo-site" href="/v4/">
                    <img src="./img/logo.png" alt="Sean's surf report">
                </a>
                <a class="icon-dash" href="/dashboard">
                    <img src="./img/icon_01_dash.png" alt="Dashboard">
                </a>
                <a class="icon-forecast" href="/forecast">
                    <img src="./img/icon_02_forecast.png" alt="Forecast">
                </a>
                <a class="icon-community" href="#">
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

  handleDashClick(event) {
    event.preventDefault();
    const main = document.querySelector("site-main");
    const feed = document.querySelector("site-feed");
    if (!main) return;

    // Unload community content if active
    if (typeof window.unloadCommunityContent === "function") {
      window.unloadCommunityContent();
    }

    // Load dashboard
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
      } else {
        console.error("loadDashContent function not found");
      }
    };
    script.onerror = () => {
      console.error("Failed to load site-dash.js");
      main.innerHTML = "<p>Error loading dashboard</p>";
    };
    document.body.appendChild(script);

    // Show site-feed
    if (feed) {
      feed.style.display = "";
    }
  }

  handleForecastClick(event) {
    event.preventDefault();
    const main = document.querySelector("site-main");
    const nav = document.querySelector("site-nav");
    const feed = document.querySelector("site-feed");
    if (!nav || !main) return;

    // Unload community content if active
    if (typeof window.unloadCommunityContent === "function") {
      window.unloadCommunityContent();
    }

    // Load forecast
    nav.loadPage("kbc");

    // Show site-feed
    if (feed) {
      feed.style.display = "";
    }
  }

  handleCommunityClick(event) {
    event.preventDefault();
    const main = document.querySelector("site-main");
    if (!main) return;

    // Unload any existing community script
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
