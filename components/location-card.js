
  // Define the custom element
  class LocationCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
  
        // Get attributes or set default values
        const imageUrl = this.getAttribute('image-url') || '';
        const title = this.getAttribute('title') || '';
        const linkUrl = this.getAttribute('link-url') || '#';
        const refreshInterval = parseInt(this.getAttribute('refresh-interval')) || 60000; // Default: 1 minute

        this.imageClickCallback = this.getAttribute('image-click-callback');
  
        // Create the card structure
        this.shadowRoot.innerHTML = `
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />


        <style>
        
        .card {
            position: relative;
        }

        .card-body span {
            font-size: 0.8rem;
        }

        .card-body a:hover>span {
          color: #5d5dff;
          transition: all 0.2s;
        }   
        
        /** Card images */
        
        .card-img-top {
          transition: transform 0.3s ease, filter 0.3s ease;
          max-height: 150px; /* Set the maximum height to 150px */
        }
        
        .card-img-top:hover {
          filter: brightness(1.3);
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

        #thumbnail:hover {
            cursor: pointer;
        }
        
        .refresh {
          display: none;
          position: absolute;
          z-index: 1000;
          top: 0;
          right: 0;
          padding: 2px 10px;
          background: var(--primary);;
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
          max-height: 150px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        }
        
        </style>

          <div class="p-2">
            <div class="card shadow-sm">
                <img id="thumbnail" class="object-fit-cover card-img-top" src="${imageUrl}" height="225" />
                <button id="refreshButton" class="refresh btn btn-sm" onclick="handleButtonRefreshClick(event)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                    <path
                      d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                  </svg>
                </button>
 
              <div class="card-body px-2 shadow-sm">
                <div class="d-flex justify-content-between align-items-center">
                  <a href="${linkUrl}" target="_blank" rel="noopener noreferrer">
                    <span class="text-body-primary fw-bold d-none d-sm-block">${title}</span>
                  </a>
                  <button onclick="setModalContent('uaq', 'forecast')" type="button"
                    class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#data-modal">
                    Forecast
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;

           // Set up the image refreshing interval
        this.imageRefreshInterval = setInterval(() => {
            this.refreshImage();
        }, refreshInterval); // Refresh every minute

         // Bind the refresh button click event to the handleRefreshButtonClick function
        this.shadowRoot.getElementById('refreshButton').addEventListener('click', () => this.handleRefreshButtonClick());
        this.shadowRoot.getElementById('thumbnail').addEventListener('click', () => this.handleImageClick());
      }

                // Handle image click
        handleImageClick() {
            // Call the provided callback function if available
            const imageUrl = this.getAttribute('image-url');
            const linkUrl = this.getAttribute('link-url');

            if (this.imageClickCallback && window[this.imageClickCallback] && typeof window[this.imageClickCallback] === 'function') {
                console.log('Executed!', imageUrl, linkUrl)
                window[this.imageClickCallback](imageUrl, linkUrl);
            }
        }

        // Refresh the image by appending a timestamp
        refreshImage() {
            const timestamp = new Date().getTime();
            const imgElement = this.shadowRoot.querySelector('.card-img-top');
            imgElement.closest('.card').classList.add('is-loading');
            imgElement.style.opacity = '0.3';
            imgElement.src = `${imgElement.src}?timestamp=${timestamp}`;
            imgElement.onload = () => setTimeout(() => imgElement.style.opacity = '1', 1000);
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
  customElements.define('location-card', LocationCard);
