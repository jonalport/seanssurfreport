// Define the custom element for location-card
class LocationCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Get attributes or set default values
    const imageUrl = this.getAttribute("image-url") || ""; // Initially empty or set later
    const title = this.getAttribute("title") || "";
    const emitdata = this.getAttribute("emitdata");
    const linkUrl = this.getAttribute("link-url") || "#";
    const hideRefreshBtn = this.getAttribute("hide-refresh");

    const refreshInterval =
      parseInt(this.getAttribute("refresh-interval")) || 60000; // Default: 1 minute

    this.imageClickCallback = this.getAttribute("image-click-callback");
    const titleHtml = emitdata
      ? `<span class="location-card text-body-primary fw-bold d-sm-block">${title}</span>`
      : `<a href="${linkUrl}" role="link" target="_blank" rel="noopener noreferrer">
          <span class="location-card text-body-primary fw-bold d-sm-block">${title}</span>
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

    // Create the card structure with a placeholder image initially
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
                    src="${imageUrl || './img/blurred.png'}"   
                  />
                  ${refreshButton}
              </div>
            <div class="card-body px-2 shadow-sm ${titlePadding}">
                <div class="d-flex justify-content-center align-items-center">
                  ${titleHtml}
                </div>
              </div>
            </div>
            ${linkUrl !== "#" ? `</a>` : `</div>`}
        `;

    // Get the img element
    const imgElement = this.shadowRoot.getElementById("thumbnail");

    // Check if the image is already loaded
    if (imgElement.complete && imageUrl) {
      this.handleImageLoad({ target: imgElement });
    } else if (imageUrl) {
      // If not loaded, add the onload event listener
      imgElement.onload = (e) => this.handleImageLoad(e);
    }

    // Set up the image refreshing interval only if there's an image URL
    if (imageUrl) {
      this.imageRefreshInterval = setInterval(() => {
        this.refreshImage();
      }, refreshInterval);
    }

    // Bind the refresh button click event
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
        if (event.code === "Enter" || event.code === "Space") {
          this.handleCardClick();
        }
      });

    // Observe attribute changes
    this.attributeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "image-url") {
          this.updateImage();
        }
      });
    });
    this.attributeObserver.observe(this, { attributes: true });
  }

  // Update image when image-url changes
  updateImage() {
    const imageUrl = this.getAttribute("image-url");
    const imgElement = this.shadowRoot.getElementById("thumbnail");
    if (imageUrl && imgElement.src !== imageUrl) {
      imgElement.src = imageUrl;
      imgElement.onload = (e) => this.handleImageLoad(e);
      if (!this.imageRefreshInterval) {
        const refreshInterval = parseInt(this.getAttribute("refresh-interval")) || 60000;
        this.imageRefreshInterval = setInterval(() => {
          this.refreshImage();
        }, refreshInterval);
      }
    }
  }

  handleImageLoad(e) {
    e.target.classList.add("loaded", "slide-in-blurred-top");
  }

  handleImageClick() {
    console.log("clicked");
    const imageUrl = this.getAttribute("image-url");
    const linkUrl = this.getAttribute("link-url");
    const emitData = this.getAttribute("emitdata");
    if (emitData) {
      const customEvent = new CustomEvent("cardClick", { detail: emitData });
      window.dispatchEvent(customEvent);
    }
    if (
      this.imageClickCallback &&
      window[this.imageClickCallback] &&
      typeof window[this.imageClickCallback] === "function"
    ) {
      window[this.imageClickCallback](emitData, imageUrl, linkUrl);
    }
  }

  refreshImage(e) {
    e?.preventDefault();
    e?.stopPropagation();
    const timestamp = new Date().getTime();
    const imgElement = this.shadowRoot.querySelector(".card-img-top");
    imgElement.closest(".card").classList.add("is-loading");
    imgElement.style.opacity = "0.3";
    imgElement.src = `${imgElement.src.split('?')[0]}?timestamp=${timestamp}`;
    imgElement.onload = () =>
      setTimeout(() => (imgElement.style.opacity = "1"), 1000);
  }

  handleRefreshButtonClick() {
    this.refreshImage();
  }

  handleCardClick() {
    // Placeholder for keyboard interaction; can be expanded if needed
    this.handleImageClick();
  }

  disconnectedCallback() {
    clearInterval(this.imageRefreshInterval);
    this.attributeObserver.disconnect();
  }
}

customElements.define("location-card", LocationCard);

// Configuration object for all locations
const locations = {
    'kbc': {
        name: 'Kitesurf Beach Center, UAQ',
        description: 'Located an hour NE of Dubai in the emirate of Umm Al Quwain, KBC is well located to receive good wind and swell when the conditions align. You will also find a nice community of local riders and some incredible food on the restaurants menu - <a href="https://kitesurfbeachcenter.ae" target="_blank" rel="noopener noreferrer">website</a> This is the google pin, beware of the camera on the beach road just before you reach, it catches everyone - <a href="https://maps.app.goo.gl/VZhkFiuGVY2ercHN7" target="_blank" rel="noopener noreferrer">location</a>',
        cameraUrl: 'https://worker.seanssurfreport.com/kbc',
        windScriptId: 'wglive_2146_1617178001640',
        windArgs: ["spot=2146", "uid=wglive_2146_1617178001640", "direct=1", "wj=knots", "tj=c", "avg_min=0", "gsize=300", "msize=300", "m=3", "show=n,g,c"],
        forecastScriptId: 'wg_fwdg_687932_100_1617177954510',
        forecastArgs: ["s=687932", "m=100", "mw=84", "uid=wg_fwdg_687932_100_1617177954510", "wj=knots", "tj=c", "waj=m", "odh=0", "doh=24", "fhours=240", "hrsm=2", "vt=forecasts", "lng=en", "idbs=1", "p=WINDSPD,GUST,SMER,HTSGW,PERPW,DIRPW,TMPE,CDC,APCP1s"]
    },
    'bos': {
        name: 'Blue Ocean Sports, Jebel Ali',
        description: 'Nestled at the base of Palm Jebel Ali in the JA Resort hotel is this flat water paradise. Blue Ocean Sports is a leading watersports centre in the emirate of Dubai - <a href="https://www.blue-ocean-sports.com/" target="_blank" rel="noopener noreferrer">website</a>',
        cameraUrl: 'https://worker.seanssurfreport.com/bos',
        windScriptId: 'wglive_3568_1668852175054',
        windArgs: ["spot=3568", "uid=wglive_3568_1668852175054", "direct=1", "wj=knots", "tj=c", "avg_min=0", "gsize=250", "msize=300", "m=3", "show=n,g,c"],
        forecastScriptId: 'wg_fwdg_1136989_3_1668852348455',
        forecastArgs: ["s=1136989", "m=100", "mw=84", "uid=wg_fwdg_1136989_3_1668852348455", "wj=knots", "tj=c", "waj=m", "odh=0", "doh=24", "fhours=240", "hrsm=2", "vt=forecasts", "lng=en", "idbs=1", "p=WINDSPD,GUST,SMER,HTSGW,PERPW,DIRPW,TMPE,CDC,APCP1s"]
    },
    'yas': {
        name: 'Yas Kite & Wing Area, Abu Dhabi',
        description: 'Situated on Yas Island North in Abu Dhabi, about 1 hour drive south from Dubai. This spot has a large riding area and is isolated with not much around which means it doesn\'t feel the crowds. It\'s also flat water which makes it amazing for learning - <a href="https://kitetribe.ae/">website</a>',
        cameraUrl: 'https://worker.seanssurfreport.com/yas',
        windScriptId: 'wglive_3858_1710778532615',
        windArgs: ["spot=3858", "uid=wglive_3858_1710778532615", "direct=1", "wj=knots", "tj=c", "avg_min=0", "gsize=250", "msize=300", "m=3", "show=n,g,c"],
        forecastScriptId: 'wg_fwdg_207_100_1710778742102',
        forecastArgs: ["s=207", "m=100", "mw=84", "uid=wg_fwdg_207_100_1710778742102", "wj=knots", "tj=c", "waj=m", "odh=0", "doh=24", "fhours=240", "hrsm=2", "vt=forecasts", "lng=en", "idbs=1", "p=WINDSPD,GUST,SMER,PERPW,TMPE,CDC,APCP1s"]
    },
    'dosc': {
        name: 'Dubai Offshore Sailing Club',
        description: 'Established in 1974, DOSC is an exclusive club that provides and hosts sailing courses, races, corporate events as well as a clubhouse and private beach. DOSC has excellent facilities enjoyed by over 700 members. - <a href="https://www.dosc.ae">website</a>',
        cameraUrl: 'https://worker.seanssurfreport.com/dosc',
        windScriptId: 'wglive_4065_1715857744393',
        windArgs: ["spot=4065", "uid=wglive_4065_1715857744393", "direct=1", "wj=knots", "tj=c", "avg_min=0", "gsize=250", "msize=300", "m=3", "show=n,g,c"],
        forecastScriptId: 'wg_fwdg_1192330_100_1715857483783',
        forecastArgs: ["s=1192330", "m=100", "mw=84", "uid=wg_fwdg_1192330_100_1715857483783", "wj=knots", "tj=c", "waj=m", "odh=0", "doh=24", "fhours=240", "hrsm=2", "vt=forecasts", "lng=en", "idbs=1", "p=WINDSPD,GUST,SMER,HTSGW,PERPW,DIRPW,TMPE,CDC,APCP1s"]
    },
    'sandy': {
        name: 'Sandy Beach Hotel, Dibba',
        description: 'On the east coast in Fujairah is a little town called Dibba, which is home to arguably the best surf spot in the country (when it works). It\'s a quiet place with an impressive mountain range and a different ocean which is mostly protected - but depending on certain distant storms - can deliver a good SE swell which hits Tim\'s Reef perfectly.',
        cameraUrl: 'https://worker.seanssurfreport.com/sandy',
        windScriptId: 'wglive_2014_1617178111305',
        windArgs: ["spot=2014", "uid=wglive_2014_1617178111305", "direct=1", "wj=knots", "tj=c", "avg_min=0", "gsize=250", "msize=300", "m=3", "show=n,g,c"],
        forecastScriptId: 'wg_fwdg_875305_3_1617178214856',
        forecastArgs: ["s=875305", "m=100", "mw=84", "uid=wg_fwdg_875305_3_1617178214856", "wj=knots", "tj=c", "waj=m", "odh=0", "doh=24", "fhours=240", "hrsm=2", "vt=forecasts", "lng=en", "idbs=1", "p=WINDSPD,GUST,SMER,HTSGW,PERPW,DIRPW,TMPE,CDC,APCP1s"]
    },
    'mikoko': {
        name: 'Mikoko, UAQ',
        description: 'Situated in Umm Al Quwain, Mikoko is a luxurious oasis in the heart of the mangrove forests. This is a flatwater spot that is good for kiting but can be tricky on very low tides. There are chalets on the water\'s edge and a restaurant with an upstairs viewing deck - <a href="https://casamikoko.ae" target="_blank" rel="noopener noreferrer">website</a>',
        cameraUrl: 'https://worker.seanssurfreport.com/mikoko',
        windScriptId: 'wglive_3568_1668852175054',
        windArgs: ["spot=3568", "uid=wglive_3568_1668852175054", "direct=1", "wj=knots", "tj=c", "avg_min=0", "gsize=250", "msize=300", "m=3", "show=n,g,c"],
        forecastScriptId: 'wg_fwdg_1136989_3_1668852348455',
        forecastArgs: ["s=1136989", "m=100", "mw=84", "uid=wg_fwdg_bos_67890", "wj=knots", "tj=c", "waj=m", "odh=0", "doh=24", "fhours=240", "hrsm=2", "vt=forecasts", "lng=en", "idbs=1", "p=WINDSPD,GUST,SMER,HTSGW,PERPW,DIRPW,TMPE,CDC,APCP1s"]
    },
};

window.loadSiteContent = function(main, locationId) {
  const location = locations[locationId];
  if (!location) {
      main.innerHTML = '<p>Location not found.</p>';
      return;
  }

  // Determine if this is the KBC location
  const isKbc = locationId === 'kbc';

  // Define the video stream HTML for KBC
  const videoHtml = isKbc ? `
      <video 
          id="kbc-video" 
          controls 
          muted 
          style="display: none; width: 100%; aspect-ratio: 16 / 9;"
      ></video>
  ` : '';

  // Define the title block HTML, including the slider for KBC
  const titleBlockHtml = isKbc ? `
      <div class="title-content-wrapper">
          <span class="title-content">Live Camera</span>
          <label class="video-toggle-block">
              <span class="video-toggle-label">Video</span>
              <input type="checkbox" id="video-toggle">
              <span class="slider"></span>
          </label>
      </div>
  ` : `
      <div class="title-content">Live Camera</div>
  `;

  // Set the HTML content
  main.innerHTML = `
      <section>
          <div id="info" class="content-block"><h1>${location.name}</h1><p>${location.description}</p></div>
          <div id="camera-title" class="content-block title-block">${titleBlockHtml}</div>
          <div id="camera-image" class="content-block">
              <div style="position: relative;">
                  <location-card 
                      refresh-interval="60000"
                      hide-refresh="true">
                  </location-card>
                  ${videoHtml}
              </div>
          </div>
          <div id="wind-title" class="content-block title-block"><div class="title-content">Live Wind</div></div>
          <div id="wind-graph" class="content-block"><div style="max-width: 100%;"></div></div>
          <div id="forecast-title" class="content-block title-block"><div class="title-content">Forecast</div></div>
          <div id="forecast-graph" class="content-block"><div style="max-width: 100%;"></div></div>
      </section>
  `;

  // Set the image-url dynamically after the element is in the DOM
  const locationCard = main.querySelector('location-card');
  if (locationCard) {
      const timestamp = new Date().getTime();
      locationCard.setAttribute('image-url', `${location.cameraUrl}?t=${timestamp}`);
  }

  // Add toggle functionality for KBC video
  if (isKbc) {
      const videoToggle = main.querySelector('#video-toggle');
      const videoElement = main.querySelector('#kbc-video');
      const locationCardElement = main.querySelector('location-card');

      // Load hls.js dynamically
      const hlsScript = document.createElement('script');
      hlsScript.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.15';
      hlsScript.async = true;
      document.head.appendChild(hlsScript);

      let hls = null;
      let autoToggleTimer = null;

      videoToggle.addEventListener('change', () => {
          // Clear any existing timer when toggle state changes
          if (autoToggleTimer) {
              clearTimeout(autoToggleTimer);
              autoToggleTimer = null;
          }

          if (videoToggle.checked) {
              // Keep image visible, hide video
              locationCardElement.style.display = 'block';
              videoElement.style.display = 'none';

              // Initialize HLS
              const videoSrc = 'https://video-kbc.seanssurfreport.com/memfs/ee84899f-5b53-46f7-a684-9ad94c49774e.m3u8';
              if (typeof Hls !== 'undefined' && Hls.isSupported()) {
                  hls = new Hls();
                  hls.loadSource(videoSrc);
                  hls.attachMedia(videoElement);
                  hls.on(Hls.Events.MANIFEST_PARSED, () => {
                      // Wait for play event to switch to video
                      const onPlay = () => {
                          locationCardElement.style.display = 'none';
                          videoElement.style.display = 'block';
                          videoElement.removeEventListener('play', onPlay);
                          // Start 2-minute timer to auto-toggle off
                          autoToggleTimer = setTimeout(() => {
                              videoToggle.checked = false;
                              videoToggle.dispatchEvent(new Event('change'));
                          }, 120 * 1000); // 120 seconds
                      };
                      videoElement.addEventListener('play', onPlay);
                      videoElement.play().catch((error) => {
                          console.error('Video playback failed:', error);
                          locationCardElement.style.display = 'block';
                          videoElement.style.display = 'none';
                          videoElement.removeEventListener('play', onPlay);
                      });
                  });
                  hls.on(Hls.Events.ERROR, (event, data) => {
                      console.error('HLS error:', data);
                      locationCardElement.style.display = 'block';
                      videoElement.style.display = 'none';
                  });
              } else if (videoElement.canPlayType('application/vnd.apple.mpegurl')) {
                  // Native HLS support (e.g., Safari)
                  videoElement.src = videoSrc;
                  const onPlay = () => {
                      locationCardElement.style.display = 'none';
                      videoElement.style.display = 'block';
                      videoElement.removeEventListener('play', onPlay);
                      // Start 2-minute timer to auto-toggle off
                      autoToggleTimer = setTimeout(() => {
                          videoToggle.checked = false;
                          videoToggle.dispatchEvent(new Event('change'));
                      }, 120 * 1000); // 120 seconds
                  };
                  videoElement.addEventListener('play', onPlay, { once: true });
                  videoElement.addEventListener('loadedmetadata', () => {
                      videoElement.play().catch((error) => {
                          console.error('Video playback failed:', error);
                          locationCardElement.style.display = 'block';
                          videoElement.style.display = 'none';
                          videoElement.removeEventListener('play', onPlay);
                      });
                  }, { once: true });
                  videoElement.addEventListener('error', () => {
                      locationCardElement.style.display = 'block';
                      videoElement.style.display = 'none';
                  }, { once: true });
              } else {
                  // No HLS support
                  locationCardElement.style.display = 'block';
                  videoElement.style.display = 'none';
              }
          } else {
              // Show image, hide video
              locationCardElement.style.display = 'block';
              videoElement.style.display = 'none';
              // Clean up HLS
              if (hls) {
                  hls.destroy();
                  hls = null;
              }
              videoElement.pause();
              videoElement.src = '';
              videoElement.currentTime = 0;
          }
      });
  }

  // Clean up previous Windguru scripts
  const windGraph = main.querySelector('#wind-graph div');
  const forecastGraph = main.querySelector('#forecast-graph div');
  const existingWindScript = document.getElementById(location.windScriptId);
  const existingForecastScript = document.getElementById(location.forecastScriptId);
  if (existingWindScript) existingWindScript.remove();
  if (existingForecastScript) existingForecastScript.remove();

  // Add the Windguru live wind script
  const windScript = document.createElement('script');
  windScript.id = location.windScriptId;
  windScript.textContent = `
      (function (window, document) {
          var loader = function () {
              var arg = ${JSON.stringify(location.windArgs)};
              var script = document.createElement("script");
              var tag = document.getElementsByTagName("script")[0];
              script.src = "https://www.windguru.cz/js/wglive.php?" + (arg.join("&"));
              tag.parentNode.insertBefore(script, tag);
          };
          loader();
      })(window, document);
  `;
  windGraph.appendChild(windScript);

  // Add the Windguru forecast script
  const forecastScript = document.createElement('script');
  forecastScript.id = location.forecastScriptId;
  forecastScript.textContent = `
      (function (window, document) {
          var loader = function () {
              var arg = ${JSON.stringify(location.forecastArgs)};
              var script = document.createElement("script");
              var tag = document.getElementsByTagName("script")[0];
              script.src = "https://www.windguru.cz/js/widget.php?" + (arg.join("&"));
              tag.parentNode.insertBefore(script, tag);
          };
          loader();
      })(window, document);
  `;
  forecastGraph.appendChild(forecastScript);

  // Add styles (only once, if not already added)
  if (!document.querySelector('style#site-forecast-styles')) {
      const style = document.createElement('style');
      style.id = 'site-forecast-styles';
      style.textContent = `
          section { width: 90%; display: flex; flex-direction: column; gap: 10px; margin: 1rem auto; }
          .content-block { width: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center; height: auto; box-sizing: border-box; }
          .content-block > div:not(.title-content):not(.title-content-wrapper) { width: 100%; max-width: 600px; text-align: center; margin-bottom: 10px; }
          .content-block > div:last-child { margin-bottom: 0; }
          #camera-image > div { max-width: none; }
          .title-block { font-size: 0.9rem; font-weight: 400; padding: 5px; }
          .title-content { background-color: #000; color: #fff; display: inline-block; padding: 5px 15px; border-radius: 50px; width: auto; line-height: 1; white-space: nowrap; font-family: 'Roboto', sans-serif; }
          p { font-size: 0.95rem; text-align: center; width: 95%; }
          #wind-graph { width: 100%; margin: 0 auto; }
          #wind-graph iframe { border: 0 solid #000 !important; }
          #forecast-graph { width: 100%; margin: 0 auto; }
          
          /* KBC-specific styles */
          .title-content-wrapper {
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
          }
          .video-toggle-block {
              display: flex;
              align-items: center;
              gap: 5px;
              cursor: pointer;
          }
          .video-toggle-label {
              font-size: 0.9rem;
              color: #000;
              font-family: 'Roboto', sans-serif;
          }
          .video-toggle-block input[type="checkbox"] {
              display: none;
          }
          .slider {
              position: relative;
              display: inline-block;
              width: 34px;
              height: 20px;
              background-color: #ccc;
              border-radius: 20px;
              transition: background-color: 0.3s;
          }
          .slider:before {
              position: absolute;
              content: "";
              height: 16px;
              width: 16px;
              left: 2px;
              bottom: 2px;
              background-color: white;
              border-radius: 50%;
              transition: transform 0.3s;
          }
          input[type="checkbox"]:checked + .slider {
              background-color: #3c67d7;
          }
          input[type="checkbox"]:checked + .slider:before {
              transform: translateX(14px);
          }
          #kbc-video {
              width: 100%;
              aspect-ratio: 16 / 9;
          }
      `;
      document.head.appendChild(style);
  }
};

// Cleanup function to remove forecast-specific styles and scripts
window.unloadSiteContent = function(main) {
    // Remove the forecast styles
    const forecastStyles = document.getElementById('site-forecast-styles');
    if (forecastStyles) forecastStyles.remove();

    // Clean up Windguru scripts
    const windScripts = document.querySelectorAll('script[id^="wglive_"]');
    windScripts.forEach(script => script.remove());
    const forecastScripts = document.querySelectorAll('script[id^="wg_fwdg_"]');
    forecastScripts.forEach(script => script.remove());

    // Clean up hls.js script
    const hlsScript = document.querySelector('script[src*="hls.js"]');
    if (hlsScript) hlsScript.remove();
};