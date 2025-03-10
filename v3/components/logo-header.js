class LogoHeader extends HTMLElement {
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
        @media (min-width: 480px) {
          .logo-link img {
            width: 35%;
          }
        }

        @media (min-width: 780px) {
          .logo-link img {
            width: 25%;
          }
        }

        @media (min-width: 1200px) {
          .logo-link img {
            width: 20%;
          }
        }

        header {
          background-color: #141414;
          padding: 1vw;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .logo-group {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 3vw;
          flex-wrap: nowrap;
        }

        .logo-link {
          display: flex;
          align-items: center;
        }

        .logo-link img {
          width: 22vw;
          height: auto;
          min-width: 200px;
          max-width: 100%;
        }

        .main-nav-link {
          display: flex;
          align-items: center;
          position: relative;
        }

        .main-nav-link img {
          width: 4vw;
          height: auto;
          max-width: 120px;
          min-width: 50px;
          opacity: 75%;
          transition: opacity .25s ease-in-out;
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

        .notification-bubble {
          display: none;
          position: absolute;
          top: -5px;
          right: -5px;
          width: 10px;
          height: 10px;
          background-color: red;
          border-radius: 50%;
        }

        .notification-bubble.active {
          display: block;
        }
      </style>

      <header>
        <div class="logo-group">
          <a class="logo-link" href="/">
            <img src="./img/logo.png" alt="Sean's surf report">
          </a>
          <a class="main-nav-link" href="https://community.seanssurfreport.com/">
            <img src="./img/community_320.png" alt="Classifieds">
            <span class="notification-bubble active"></span>
          </a>
        </div>
      </header>
    `;
  }
}

customElements.define('logo-header', LogoHeader);