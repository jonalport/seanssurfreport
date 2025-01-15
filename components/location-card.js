// Define the custom element
class LocationCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Get attributes or set default values
    const imageUrl = this.getAttribute("image-url") || "";
    const title = this.getAttribute("title") || "";
    const emitdata = this.getAttribute("emitdata");
    const linkUrl = this.getAttribute("link-url") || "#";
    const hideRefreshBtn = this.getAttribute("hide-refresh");

    const refreshInterval =
      parseInt(this.getAttribute("refresh-interval")) || 60000; // Default: 1 minute

    this.imageClickCallback = this.getAttribute("image-click-callback");
    const titleHtml = emitdata
      ? `<span class="location-card text-body-primary fw-bold d-sm-block ">${title}</span>`
      : `<a href="${linkUrl}" role="link" target="_blank" rel="noopener noreferrer">
          <span class="location-card text-body-primary fw-bold  d-sm-block">${title}</span>
        </a>`;

    const thumbnailClass = title ? "thumbnail" : "";
    const titlePadding = title ? "" : "p-0";

    const refreshButton = hideRefreshBtn
      ? ""
      : `<button id="refreshButton" class="refresh btn btn-sm">
          Refresh
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
            <path
              d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
          </svg>
        </button>`;

    // Create the card structure
    this.shadowRoot.innerHTML = `
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />


        <style>
        
        .card {
            position: relative;
            min-width: 250px;
            margin: 0 0.5rem;
        }

        .card:focus {
          outline: 2px solid #5d5dff;
        }

        .card-body {
          // padding: 0;
        }

        .card-body span {
            font-size: 0.9rem;
            text-decoration: none!important;
        }

        .card-body a {
          text-decoration: none;
      }


        .card:hover {
          color: #5d5dff;
          transition: all 0.2s;
        }   
        
        /** Card images */
        
        .card-img-top {
          opacity: 0;
          transition: transform 0.3s ease, filter 0.3s ease;
          background: url(./img/blurred.png);
          background-size: cover;
        }

        .loaded {
          opacity: 1; 
        }

        .bg {
          height: 100%;
          width: 100%;
          background: url(./img/blurred.png);
          background-size: cover;
        }

        .thumbnail {
          height: 250px; 
        }

        @media (max-width: 680px){
          .thumbnail {
            max-height: 200px;
          }
        }
        
        .thumbnail:hover {
          filter: brightness(1.3)!important;
          cursor: pointer;
        }
        
        .viewtype {
          position: relative;
        }
        
        .viewtype img {
          margin-bottom: 1rem;
        }
        
        /** image refresh button */
        
        .card a {
          position: relative;
          color: #444;
            text-decoration: none;
            font-weight: 900;
            text-transform: uppercase;
            margin: 0;
            margin-top: -2px;
            padding: 0;
        }

        #thumbnail {
            position: relative;
        }
        
        .refresh {
          display: none;
          position: absolute;
          z-index: 1000;
          top: 10px;
          right: 10px;
          padding: 2px 10px;
          background: #3c67d7;
          color: white
        }
        
        
        .cam .refresh {
          display: none;
          position: absolute;
          z-index: 10000;
          top: 60px;
          right: 15px;
          padding: 2px 10px;
          background: var(--primary);
          color: white
        }
        
        .refresh:hover {
          color: white;
          background-color: var(--secondary_gray);
        }
        
        .card:hover .refresh,
        .cam:hover .refresh {
          display: inline-block;
          /* Show the button when hovering over the <a> tag */
        }
              

        /** Loading Skeleton */
        
        .card.is-loading .card-img-top {
          background: #eee;
          background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
          border-radius: 5px;
          background-size: 200% 100%;
          animation: shine 1.5s linear infinite;
        }
        
        .card.is-loading .card-img-top {
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }

        .location-card:focus {
          outline: 2px solid #5d5dff;
        }


        a[role=button] {
          text-decoration: none!important;
        }

        .slide-in-blurred-top {
          -webkit-animation: slide-in-blurred-top 1.5s cubic-bezier(0.230, 1.000, 0.320, 1.000) forwards;
                  animation: slide-in-blurred-top 1.5s cubic-bezier(0.230, 1.000, 0.320, 1.000) forwards;
      }

        @-webkit-keyframes slide-in-blurred-top {
          0% {
            -webkit-filter: blur(40px);
                    filter: blur(40px);
            opacity: 0;
          }
          100% {
            -webkit-filter: blur(0);
                    filter: blur(0);
            opacity: 1;
          }
        }
        @keyframes slide-in-blurred-top {
          0% {
            -webkit-filter: blur(40px);
                    filter: blur(40px);
            opacity: 0;
          }
          100% {
            -webkit-filter: blur(0);
                    filter: blur(0);
            opacity: 1;
          }
        }
        </style>


         ${
           linkUrl !== "#"
             ? `<a href="${linkUrl}" id="card">`
             : `<div id="card">`
         }
            <div class="card shadow-sm">
              <div class="bg">
                  <img id="thumbnail" 
                    class="object-fit-cover card-img-top ${thumbnailClass}" 
                    src="${imageUrl}"   
                  />
                  ${refreshButton}
              </div>
            <div class="card-body px-2 shadow-sm ${titlePadding}">
                <div class="d-flex justify-content-center align-items-center">
                  ${titleHtml}
                </div>
              </div>
            </div>
            ${!linkUrl ? `</a>` : `</div`}
        `;

    // Get the img element
    const imgElement = this.shadowRoot.getElementById("thumbnail");

    // Check if the image is already loaded
    if (imgElement.complete) {
      this.handleImageLoad({ target: imgElement });
    } else {
      // If not loaded, add the onload event listener
      imgElement.onload = (e) => this.handleImageLoad(e);
    }

    // Set up the image refreshing interval
    this.imageRefreshInterval = setInterval(() => {
      this.refreshImage();
    }, refreshInterval); // Refresh every minute

    // Bind the refresh button click event to the handleRefreshButtonClick function
    if (!hideRefreshBtn) {
      this.shadowRoot
        .getElementById("refreshButton")
        .addEventListener("click", () => this.handleRefreshButtonClick());
    }
    if (this.emitdata) {
      this.shadowRoot
        .getElementById("card")
        .addEventListener("click", () => this.handleImageClick());
    }
    this.shadowRoot
      .getElementById("card")
      .addEventListener("keydown", (event) => {
        // Handle keyboard events
        if (event.code === "Enter" || event.code === "Space") {
          this.handleCardClick();
        }
      });
  }

  handleImageLoad(e) {
    e.target.classList.add("loaded", "slide-in-blurred-top");
  }

  // Handle image click
  handleImageClick() {
    console.log("clicked");
    // Call the provided callback function if available
    const imageUrl = this.getAttribute("image-url");
    const linkUrl = this.getAttribute("link-url");
    const emitData = this.getAttribute("emitdata");
    console.log(emitData);
    if (emitData) {
      // If emitdata attribute is present, dispatch a custom event
      const customEvent = new CustomEvent("cardClick", { detail: emitData });
      window.dispatchEvent(customEvent);
    }

    if (
      this.imageClickCallback &&
      window[this.imageClickCallback] &&
      typeof window[this.imageClickCallback] === "function"
    ) {
      console.log("Executed!", imageUrl, linkUrl);
      window[this.imageClickCallback](emitData, imageUrl, linkUrl);
    }
  }

  // Refresh the image by appending a timestamp
  refreshImage(e) {
    e?.preventDefault();
    e?.stopPropagation();
    const timestamp = new Date().getTime();
    const imgElement = this.shadowRoot.querySelector(".card-img-top");
    imgElement.closest(".card").classList.add("is-loading");
    imgElement.style.opacity = "0.3";
    imgElement.src = `${imgElement.src}?timestamp=${timestamp}`;
    imgElement.onload = () =>
      setTimeout(() => (imgElement.style.opacity = "1"), 1000);
  }

  // Handle refresh button click
  handleRefreshButtonClick() {
    this.refreshImage();
  }

  // Clear the interval when the component is disconnected
  disconnectedCallback() {
    clearInterval(this.imageRefreshInterval);
  }
}

// Define the custom element "image-card"
customElements.define("location-card", LocationCard);
