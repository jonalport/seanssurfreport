// Define the template for the web component
const template = document.createElement("template");
template.innerHTML = `
  <style>
    .retro-counter {
      font-family: monospace;
      font-size: 20px;
    }

    @media(max-width: 680px){
      .retro-counter {
        font-size: 18px;
      }
    }
  </style>
  <div class="retro-counter">
    Total Visits: <span id="counter">Loading...</span>
  </div>
`;

class PageHitCounter extends HTMLElement {
  constructor() {
    super();

    // Create a shadow DOM
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // Get the serverUrl attribute value
    this.serverUrl = this.getAttribute("server-url");

    // Fetch the page hit count from the server
    this.fetchHitCount();
  }

  fetchHitCount() {
    if (!this.serverUrl) return;
    fetch(this.serverUrl)
      .then((response) => response.json())
      .then((data) => {
        const counterElement = this.shadowRoot.getElementById("counter");
        if (counterElement) {
          counterElement.textContent = `🏄‍♀️ ${data.count} 🏄‍♂️`;
        }
      })
      .catch((error) => {
        console.error("Error fetching page hit count:", error);
      });
  }

  // Observe changes to the 'serverUrl' attribute
  static get observedAttributes() {
    return ["server-url"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "server-url" && oldValue !== newValue) {
      this.serverUrl = newValue;
      this.fetchHitCount();
    }
  }
}

// Define the custom element
customElements.define("page-hit-counter", PageHitCounter);
