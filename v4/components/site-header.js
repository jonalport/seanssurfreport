class SiteHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

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
                    height: 80px;
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
                    padding: 16px 0;
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
                    opacity: 75%;
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
                    opacity: 75%;
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
                    opacity: 75%;
                    transition: opacity .25s ease-in-out;
                    object-fit: contain;
                }

                .icon-community img:hover {
                    opacity: 100%;
                }
            </style>

            <div class="logo-group">
                <a class="logo-site" href="/">
                    <img src="./img/logo.png" alt="Sean's surf report">
                </a>
                <a class="icon-dash" href="/dashboard">
                    <img src="./img/icon_01_dash.png" alt="Dashboard">
                </a>
                <a class="icon-forecast" href="/forecast">
                    <img src="./img/icon_02_forecast.png" alt="Forecast">
                </a>
                <a class="icon-community" href="https://community.seanssurfreport.com/">
                    <img src="./img/icon_03_community.png" alt="Community">
                </a>
            </div>
        `;

        // Add event listeners for the buttons
        this.shadowRoot.querySelector('.icon-dash').addEventListener('click', this.handleDashClick.bind(this));
        this.shadowRoot.querySelector('.icon-forecast').addEventListener('click', this.handleForecastClick.bind(this));
    }

    handleDashClick(event) {
        event.preventDefault(); // Prevent default link behavior
        const main = document.querySelector('site-main');
        if (!main) return;

        // Remove any existing dashboard script
        const existingScript = document.getElementById('site-dash-script');
        if (existingScript) existingScript.remove();

        // Load site-dash.js
        const script = document.createElement('script');
        script.src = 'components/site-dash.js';
        script.id = 'site-dash-script';
        script.onload = () => {
            if (window.loadDashContent && typeof window.loadDashContent === 'function') {
                window.loadDashContent(main);
            } else {
                console.error('loadDashContent function not found');
            }
        };
        script.onerror = () => {
            console.error('Failed to load site-dash.js');
            main.innerHTML = '<p>Error loading dashboard</p>';
        };
        document.body.appendChild(script);
    }

    handleForecastClick(event) {
        event.preventDefault(); // Prevent default link behavior
        const nav = document.querySelector('site-nav');
        if (!nav) return;

        // Simulate clicking the first card in site-nav (KBC)
        nav.loadPage('kbc');
    }
}

customElements.define('site-header', SiteHeader);