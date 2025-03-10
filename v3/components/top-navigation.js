class TopNavigation extends HTMLElement {
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
            nav {
                overflow: scroll;
                background: #c9d0dc;
            }

            ul {
                list-style-type: none;
                margin: 0!important;
                padding:0!important;
                padding-inline-start: 0!important;
            }


        </style>



      
        <nav class="w-100 nav-row py-4">

            <ul class="nav-row-inner d-flex justify-content-xl-center slide-in-blurred-top">

                <li><nav-location-card image-url="https://worker.seanssurfreport.com/kbc"
                        title="Kitesurf Beach Center, UAQ" link-url="/kbc.html">
                    </nav-location-card></li>

                <li><nav-location-card image-url="https://worker.seanssurfreport.com/bos"
                        title="Blue Ocean Sports, Jebel Ali" link-url="/blue-ocean-sports.html"
                        >
                    </nav-location-card></li>

                <li><nav-location-card image-url="https://worker.seanssurfreport.com/yas"
                        title="Yas Kite Area, Abu Dhabi" link-url="/yas.html">
                    </nav-location-card></li>

                <li><nav-location-card image-url="https://worker.seanssurfreport.com/dosc"
                        title="Dubai Offshore Sailing Club" link-url="/dosc.html" >
                    </nav-location-card></li>

                <li><nav-location-card image-url="https://worker.seanssurfreport.com/sandy"
                        title="Sandy Beach Hotel, Dibba" link-url="/sandy.html" >
                    </nav-location-card></li>

                <li><nav-location-card image-url="https://worker.seanssurfreport.com/mikoko"
                        title="Mikiko, Umm Al Quwain" link-url="/mikoko.html" >
                    </nav-location-card></li>              

            </ul>
	    </nav>

  
      `;
  }
}

// Define the custom element "custom-modal"
customElements.define("top-navigation", TopNavigation);
