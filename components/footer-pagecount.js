class FooterPagecount extends HTMLElement {
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

            footer {
                text-align: center;
                padding: 20px 0;
                font-size: 14px;
                background-color: #222;
                color: white;
            }
            
            footer p {
                padding: 5px 0;
            }
          
            
            .bottom-text {
                margin-top: 4rem;
            }

            p a {
                margin: 0;
                text-decoration: underline;
                color: #87b280;
            }
            
            @media(min-width: 780px) {
                .bottom-text {
                max-width: 90%;
                margin: auto;
                }
            }
  
          </style>
  
          <footer class="pb-4">
            <div class="bottom-text" style="max-width: 800px">
                <p> It would be amazing to have these types of weather stations around the UAE. If you have any suggestions
                    or want to contribute to this project, you can reach me on
                    <a href="mailto:seanocaster@gmail.com">seanocaster@gmail.com</a>
                    or instagram <a href="https://www.instagram.com/foilandwater/">@foilandwater.</a>
                    <br><br>
                    Developed by <a href="https://www.devkylo.com/">Kyle Robinson</a>. A special thanks to <a href="https://www.instagram.com/jonalport/">Jon Alport</a>.
                </p>
            </div>
            <page-hit-counter server-url="https://worker.seanssurfreport.workers.dev/pageCount"></page-hit-counter>
        </footer>
        `;
  }
}

customElements.define("footer-pagecount", FooterPagecount);