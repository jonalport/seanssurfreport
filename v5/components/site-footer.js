class SiteFooter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
      <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
      
      <style>
        footer {
          text-align: center;
          font-size: 0.8rem;
          background-color: #141414;
          color: white;
          padding: 1rem 0;
        }
        
        footer p {
          padding: 0;
          margin: 0.3rem 1rem;
        }

        p a {
          text-decoration: underline;
          color: #87b280;
        }
        .retro-counter {
        padding: 0.2rem 0;
        }

        @media (max-width: 640px) { 
         footer {
         font-size: 0.7rem;
        }   
        }
      </style>
      
      <footer>
          <p>For suggestions, contact me via <a href="mailto:seanocaster@gmail.com">email</a>
              or <a href="https://www.instagram.com/foilandwater/">@foilandwater.</a>
          </p>
          <p>    
              Developed by <a href="https://www.devkylo.com/">Kyle Robinson</a>. A special thanks to <a href="https://www.instagram.com/jonalport/">Jon Alport</a>.
          </p>
        <div class="retro-counter">
          <span id="hit-counter">Loading...</span>
        </div>
      </footer>
    `;

    // Get the server URL and fetch hit count
    this.serverUrl = this.getAttribute("server-url") || "https://worker.seanssurfreport.com/pageCount";
    this.fetchHitCount();
  }

  fetchHitCount() {
    if (!this.serverUrl) return;
    fetch(this.serverUrl)
      .then((response) => response.json())
      .then((data) => {
        const counterElement = this.shadowRoot.getElementById("hit-counter");
        if (counterElement) {
          // Format the number with comma separators
          const formattedCount = Number(data.count).toLocaleString('en-US');
          counterElement.textContent = `${formattedCount} views`;
        }
      })
      .catch((error) => {
        console.error("Error fetching page hit count:", error);
      });
  }
}

customElements.define("site-footer", SiteFooter);