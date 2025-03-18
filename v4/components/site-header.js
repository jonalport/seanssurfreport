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
                    height: 80px; /* Fixed height */
                    width: 100%; /* Full width of the page */
                    background-color: #141414;
                }

                .logo-group {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center; /* Center the contents */
                    height: 100%; /* Fill site-header height */
                    width: auto; /* Size based on contents */
                    margin: 0; /* No margin */
                    padding: 0; /* No padding */
                }

                .logo-site {
                    display: flex;
                    align-items: center;
                    height: 100%; /* Fill logo-group height */
                    margin: 0; /* No margin */
                    padding: 10px; /* No padding */
                }

                .logo-site img {
                    height: 100%; /* Fill logo-site height */
                    width: auto; /* Maintain aspect ratio */
                    max-width: 100%; /* Prevent overflow */
                    object-fit: contain; /* Preserve aspect ratio */
                }

                .logo-community {
                    display: flex;
                    align-items: center;
                    height: 100%; /* Fill logo-group height */
                    margin: 0 0 0 10px; /* Space to the right of logo-site, no other margins */
                    padding: 10px; /* No padding */
                }

                .logo-community img {
                    height: 100%; /* Fill logo-community height */
                    width: auto; /* Maintain aspect ratio */
                    max-width: 100%; /* Prevent overflow */
                    opacity: 75%;
                    transition: opacity .25s ease-in-out;
                    object-fit: contain; /* Preserve aspect ratio */
                }

                .logo-community img:hover {
                    opacity: 100%;
                }
            </style>

            <div class="logo-group">
                <a class="logo-site" href="/">
                    <img src="./img/logo.png" alt="Sean's surf report">
                </a>
                <a class="logo-community" href="https://community.seanssurfreport.com/">
                    <img src="./img/community_320.png" alt="Classifieds">
                </a>
            </div>
        `;
    }
}

customElements.define('site-header', SiteHeader);