class LogoHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    // Create the modal structure
    this.shadowRoot.innerHTML = `
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />

          <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
          <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-ENjdO4Dr2bkBIFxQpeoTz1HIcje39Wm4jDKdf19U8gI4ddQ3GYNS7NTKfAdVQSZe"
          crossorigin="anonymous"></script>

          <style>
          @media (min-width: 480px) {
            .logo--link {
              width: 55%;
              padding: 0rem;
              margin: auto;
            }
          }

          @media (min-width: 780px) {
            .logo--link {
              margin: 0;
              width: 35%;
              padding: 0rem;
            }
          }

          @media (min-width: 1200px) {
            .logo--link {
              width: 27%;
            }
          }

          header {
            background-color: #000;
            padding: 1vw;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          header .content {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          .logo-link img {
            width: 20vw;
            height: auto;
            min-width: 200px;
            max-width: 600px;
            min-width: 240px;
          }

          .main-nav-link {
            margin-left: 3vw;
            display: block;
          }

          .main-nav-link img {
            width: 4vw;
            height: auto;
            opacity: 75%;
            transition: opacity .25s ease-in-out;
            max-width: 120px;
            min-width: 50px;
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

          .content {
            width: 90%;
            max-width: 2400px;
            margin: 0 auto;
          }

          .v3-note {
            margin-left: 2vw;
            color: #87b280;
            font-size: 1rem;
            font-family: 'Roboto', sans-serif;
            text-decoration: none;
            transition: color 200ms ease-in-out;
          }

          .v3-note:hover {
            color: #ffffff;
            text-decoration: underline;
          }

          @media (max-width: 780px) {
            .v3-note {
              font-size: 0.9rem;
            }
          }
          </style>

        <header>
          <a class="logo-link" href="/">
            <img src="./img/logo.png" alt="Sean's surf report" />
          </a>

          <a class="main-nav-link" href="https://community.seanssurfreport.com/">
            <img src="/img/community_320.png" alt="Classifieds" />
          </a>

          <!-- Added v3 site testing note and link -->
          <a class="v3-note" href="https://v3.seanssurfreport.com/" target="_blank">
            Test the new v3 interface!
          </a>
        </header>
        `;
  }
}

// Define the custom element "custom-modal"
customElements.define('logo-header', LogoHeader);