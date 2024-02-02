// Define the custom element
class NavLocationCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    // Get attributes or set default values
    const imageUrl = this.getAttribute("image-url") || "";
    const title = this.getAttribute("title") || "";
    const linkUrl = this.getAttribute("link-url") || "##";

    // Extract the substring after the first forward slash in linkUrl
    const linkUrlSubstring = linkUrl.split("/").slice(1).join("/");

    console.log({ linkUrl, linkUrlSubstring });
    // Check if the window URL contains the extracted substring
    const isLoadingClass = window.location.href.includes(linkUrlSubstring)
      ? "is-loading"
      : "";
    const isActiveTitle = window.location.href.includes(linkUrlSubstring)
      ? "is-active"
      : "";

    // Create the card structure
    this.shadowRoot.innerHTML = `
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />

  
          <style>
          
          .card {
              position: relative;
              width: 250px;
              margin: 0 0.5rem;
          }
  
          .card:focus {
            outline: 2px solid #5d5dff;
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

          .is-loading {
            position: absolute;
            height: 100%;
            width: 100%;
            top: 0; left: 0;
            background: #eee;
            background: linear-gradient(110deg, #ececec 8%, #f5f5f5 18%, #ececec 33%);
            border-radius: 5px;
            background-size: 200% 100%;
            animation: shine 1.5s linear infinite;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            z-index: 10;
            opacity: 0.7
          }

          .is-active {
            opacity: 0.7;
          }
          
          /** Card images */
          
          .card-img-top {
            opacity: 0;
            transition: transform 0.3s ease, filter 0.3s ease;
            height: 100px; 
            background: url(./img/blurred.png);
            background-size: cover;
          }
          .loaded {
            opacity: 1; 
          }

          .bg {
            height: 100px; 
            background: url(./img/blurred.png);
            background-size: cover;
          }
  
          @media (max-width: 680px){
            .card-img-top, .bg {
              height: 80px;
            }
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
          
          .location-card {
            font-size: 0.8rem;
          }
  
          .location-card:focus {
            outline: 2px solid #5d5dff;
          }
  
  
          a[role=button] {
            text-decoration: none!important;
          }

          .slide-in-blurred-top {
            -webkit-animation: slide-in-blurred-top 1s cubic-bezier(0.230, 1.000, 0.320, 1.000) forwards;
                    animation: slide-in-blurred-top 1s cubic-bezier(0.230, 1.000, 0.320, 1.000) forwards;
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


  
            <a href="${linkUrl}" id="card" >
              <div class="card shadow-sm">
                <div class="${isLoadingClass}"></div>
                <div class="bg">
                  <img id="thumbnail" class="object-fit-cover card-img-top" src="${imageUrl}" />
                </div>
                <div class="card-body px-2 shadow-sm">
                  <div class="d-flex justify-content-center align-items-center">
                    <a href="${linkUrl}" role="link" target="_blank" rel="noopener noreferrer">
                      <span class="location-card d-sm-block ${isActiveTitle}">${title}</span>
                    </a>
                  </div>
                </div>
              </div>
            </a>
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
  }

  handleImageLoad(e) {
    e.target.classList.add("loaded", "slide-in-blurred-top");
  }
}

// Define the custom element "image-card"
customElements.define("nav-location-card", NavLocationCard);
