class LocationCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const imageUrl = this.getAttribute("image-url") || "";
    const title = this.getAttribute("title") || "";
    const emitdata = this.getAttribute("emitdata");
    const linkUrl = this.getAttribute("link-url") || "#";
    const hideRefreshBtn = this.getAttribute("hide-refresh");
    const refreshInterval = parseInt(this.getAttribute("refresh-interval")) || 60000;

    this.imageClickCallback = this.getAttribute("image-click-callback");
    const titleHtml = emitdata
      ? `<span class="location-card">${title}</span>`
      : `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${title}</a>`;

    const refreshButton = hideRefreshBtn
      ? ""
      : `<button id="refreshButton" class="refresh">
          Refresh
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
          </svg>
        </button>`;

    this.shadowRoot.innerHTML = `
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <style>
          :host {
            display: block;
            width: 100%;
            text-align: center;
          }

          .card {
            width: 100%;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            min-width: 250px;
          }

          .card img {
            width: 100%;
            height: auto;
            object-fit: cover;
            opacity: 0;
            transition: opacity 0.3s ease;
          }

          .card img.loaded {
            opacity: 1;
          }

          .card-body {
            font-size: 0.9rem;
            padding: ${title ? "0.5rem 0" : "0"};
          }

          .card-body a {
            text-decoration: none;
            color: #444;
            font-weight: bold;
          }

          .card-body span {
            color: #444;
            font-weight: bold;
          }

          .refresh {
            display: none;
            position: absolute;
            top: 10px;
            right: 10px;
            padding: 2px 10px;
            background: #3c67d7;
            color: white;
            border: none;
            cursor: pointer;
          }

          .card:hover .refresh {
            display: inline-block;
          }

          .refresh:hover {
            background: #6d757d;
          }
        </style>
        ${
          linkUrl !== "#"
            ? `<a href="${linkUrl}" id="card">`
            : `<div id="card">`
        }
          <div class="card">
            <img id="thumbnail" src="${imageUrl}" />
            ${refreshButton}
            <div class="card-body">${titleHtml}</div>
          </div>
        ${linkUrl !== "#" ? `</a>` : `</div>`}
    `;

    const imgElement = this.shadowRoot.getElementById("thumbnail");
    if (imgElement.complete && imgElement.naturalWidth !== 0) {
      this.handleImageLoad({ target: imgElement });
    } else {
      imgElement.addEventListener("load", (e) => this.handleImageLoad(e));
      imgElement.addEventListener("error", () => console.error("Image failed to load:", imageUrl));
    }

    this.imageRefreshInterval = setInterval(() => this.refreshImage(), refreshInterval);

    if (!hideRefreshBtn) {
      this.shadowRoot
        .getElementById("refreshButton")
        .addEventListener("click", () => this.handleRefreshButtonClick());
    }
    if (emitdata) {
      this.shadowRoot
        .getElementById("card")
        .addEventListener("click", () => this.handleImageClick());
    }
    this.shadowRoot
      .getElementById("card")
      .addEventListener("keydown", (event) => {
        if (event.code === "Enter" || event.code === "Space") {
          this.handleCardClick();
        }
      });
  }

  handleImageLoad(e) {
    e.target.classList.add("loaded");
  }

  handleImageClick() {
    const emitData = this.getAttribute("emitdata");
    if (emitData) {
      window.dispatchEvent(new CustomEvent("cardClick", { detail: emitData }));
    }
    if (
      this.imageClickCallback &&
      window[this.imageClickCallback] &&
      typeof window[this.imageClickCallback] === "function"
    ) {
      window[this.imageClickCallback](
        emitData,
        this.getAttribute("image-url"),
        this.getAttribute("link-url")
      );
    }
  }

  refreshImage() {
    const imgElement = this.shadowRoot.querySelector("#thumbnail");
    const timestamp = new Date().getTime();
    imgElement.src = `${imgElement.src.split("?")[0]}?timestamp=${timestamp}`;
  }

  handleRefreshButtonClick() {
    this.refreshImage();
  }

  disconnectedCallback() {
    clearInterval(this.imageRefreshInterval);
  }
}

customElements.define("location-card", LocationCard);