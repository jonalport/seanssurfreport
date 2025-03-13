class SiteHeader extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });

      this.shadowRoot.innerHTML = `
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" 
          rel="stylesheet">

    <style>
      :host {
        display: block; /* Ensure the custom element takes full width */
        width: 100%; /* Stretch the custom element to full width */
      }
      @media (min-width: 480px) {
        .logo-link img { width: 35%; }
      }
      @media (min-width: 780px) {
        .logo-link img { width: 25%; }
      }
      @media (min-width: 1200px) {
        .logo-link img { width: 20%; }
      }
      header {
        background-color: #141414;
        padding: 1vw;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%; /* Make the header full width */
        box-sizing: border-box; /* Include padding in width */
      }
      .logo-group {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 3vw;
        flex-wrap: nowrap;
      }
      .logo-link { display: flex; align-items: center; }
      .logo-link img {
        width: 22vw;
        height: auto;
        min-width: 250px;
        max-width: 100%;
      }
      .main-nav-link { display: flex; align-items: center; position: relative; }
      .main-nav-link img {
        width: 4vw;
        height: auto;
        max-width: 120px;
        min-width: 50px;
        opacity: 75%;
        transition: opacity .25s ease-in-out;
      }
      .main-nav-link img:hover { opacity: 100%; }
      .header__link {
        margin-left: 1%;
        color: #ddd;
        font-size: 1.2rem;
        transition: all 200ms ease-in-out;
      }
      .header__link:hover { color: #fff; }
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
      .notification-bubble.active { display: block; }
    </style>

    <header>
      <div class="logo-group">
        <a class="logo-link" href="/">
          <img src="./img/logo.png" alt="Sean's surf report" 
               onerror="this.src='https://via.placeholder.com/250x100.png?text=Logo+Not+Found';">
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