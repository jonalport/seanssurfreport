class CustomModal extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      
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
          /* Add your modal styles here */
        </style>
        <div class="modal fade" tabindex="-1" role="dialog" id="custom-modal">
          <div class="modal-dialog modal-xl">
            <div class="modal-content">
              <div class="modal-body" id="modalBody">
                <div style="max-width: 100%;">
                  <div>
                    <div class="modal-header d-flex justify-content-between px-0 py-1">
                      <a href="#" class="btn btn-primary mx-2 my-2 mt-0">View Forecast</a>
                      <button type="button" class="btn-close m-0 pr-2 mt-0" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    
                    <div class="viewtype pt-3">
                      <img src="" class="cam" />
                      <button class="refresh btn btn-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                          class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                          <path fill-rule="evenodd"
                            d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                          <path
                            d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                        </svg>
                      </button>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
  
      // Get modal elements
    //   this.modalTitleElement = this.shadowRoot.querySelector('.modal-title');
      this.modalImageElement = this.shadowRoot.querySelector('.cam');
      this.viewForecastButton = this.shadowRoot.querySelector('.btn-primary');

          // Add an event listener to the image element
    this.modalImageElement.addEventListener('load', () => {
        this.openModal();
      });
    }
  
    openModal() {
        const modalElement = this.shadowRoot.getElementById('custom-modal');
    
        if (!this.modal) {
          this.modal = new bootstrap.Modal(modalElement);
        }
    
        // Check if the modal is already shown to prevent creating multiple backdrops
        if (!this.modal._isShown) {
          this.modal.show();
        }
      }
      
  
    // Set modal contents
    setModalContents(imageUrl, forecastLink) {
        // Append the current date as a query parameter to the image URL
        const currentDate = new Date().toISOString();
        const imageUrlWithDate = `${imageUrl}?timestamp=${currentDate}`;
        
        this.modalImageElement.src = imageUrlWithDate;
        this.viewForecastButton.href = forecastLink;
      
    }
  }
  
  // Define the custom element "custom-modal"
  customElements.define('custom-modal', CustomModal);
  