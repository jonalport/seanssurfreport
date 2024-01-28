class LogoHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

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
              width: 25%;
            }
          }

          header {
            background-color: #222;
            padding: 1% 0;
          }
          
          header .content {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
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
          
          .logo {
            width: 100%;
            padding: 1rem;
            height: auto;
            display: block;
            max-width: 100%;
          }
          
          
          </style>
  
        <header>
            <div class="content d-flex justify-content-center">
            <a href="/" class="logo--link"><img class="logo" src="./img/logo.png" alt="Sean's surf report" /></a>
            </div>
        </header>
        `;
  }
}

// Define the custom element "custom-modal"
customElements.define("logo-header", LogoHeader);
