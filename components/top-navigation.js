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
            }

            ul {
                text-decoration: none;
            }

        </style>



      
        <nav class="w-100 nav-row py-2">

            <ul class="nav-row-inner d-flex justify-content-md-center py-3">

                <li><location-card image-url="https://seanssurfreport.com/wp-content/uploads/from_kbc/picture.jpg"
                        title="Kite Beach Center, UAQ" link-url="https://kitebeachcenter.ae/" emitdata="uaq">
                    </location-card></li>

                <li><location-card image-url="https://seanssurfreport.com/wp-content/uploads/from_bos/picture.jpg"
                        title="Blue Ocean Sports, Jebel Ali" link-url="https://www.blue-ocean-sports.com/"
                        emitdata="oceanSports">
                    </location-card></li>

                <li><location-card image-url="https://seanssurfreport.com/wp-content/uploads/from_dosc/picture.jpg"
                        title="Dubai Offshore Sailing Club" link-url="https://www.instagram.com/mikoko.uaq/" emitdata="uaq">
                    </location-card></li>

                <li><location-card image-url="https://seanssurfreport.com/wp-content/uploads/from_sandy/picture.jpg"
                        title="Sandy Beach Hotel, Dibba" link-url="https://www.instagram.com/mikoko.uaq/" emitdata="sandy">
                    </location-card></li>

                <li><location-card image-url="https://seanssurfreport.com/wp-content/uploads/from_mikoko/picture.jpg"
                        title="Mikiko, Umm Al Quwain" link-url="https://www.instagram.com/mikoko.uaq/" emitdata="mikoko">
                    </location-card></li>

            </ul>
	    </nav>

  
      `;
  }
}

// Define the custom element "custom-modal"
customElements.define("top-navigation", TopNavigation);
