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
                header {
                    background-color: #141414;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    width: 100%;
                }

                .logo-group {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                    gap: 2vw;
                    flex-wrap: nowrap;
                    height: 100%;
                    width: 100%;
                }

                .logo-link {
                    display: flex;
                    align-items: center;
                    height: 100%;
                }

                .logo-link img {
                    height: 80%;
                    width: auto;
                    max-height: 4.5vh;
                    min-width: 200px;
                    max-width: 100%;
                    object-fit: contain;
                }

                .main-nav-link {
                    display: flex;
                    align-items: center;
                    position: relative;
                    height: 100%;
                }

                .main-nav-link img {
                    height: 80%; /* Fill 80% of the site-header height */
                    width: auto; /* Maintain aspect ratio */
                    max-height: 5vh;
                    min-width: 40px; /* Adjusted minimum width */
                    max-width: 100px; /* Adjusted maximum width */
                    opacity: 75%;
                    transition: opacity .25s ease-in-out;
                    object-fit: contain; /* Ensure the image fits without distortion */
                }

                .main-nav-link img:hover {
                    opacity: 100%;
                }

                .header__link {
                    margin-left: 1%;
                    color: #ddd;
                    font-size: 1.2rem;
                    transition: all 200ms ease-in-out;
                }

                .header__link:hover {
                    color: #fff;
                }

            </style>

            <header>
                <div class="logo-group">
                    <a class="logo-link" href="/">
                        <img src="./img/logo.png" alt="Sean's surf report">
                    </a>
                    <a class="main-nav-link" href="https://community.seanssurfreport.com/">
                        <img src="./img/community_320.png" alt="Classifieds">
                    </a>
                </div>
            </header>
        `;
    }
}

customElements.define('site-header', SiteHeader);