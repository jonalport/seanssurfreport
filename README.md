# seanssurfreport

This is a landing page for seanssurfreport.com.

## Dependencies
* Jquery
* Bootstrap components

## How to add new stations
The web cams and windguru reports are loaded in a modal. There is a single modal on the page, and all station content is kept there. 
Clicking on a station button will open the modal, hide all div containers for the other stations.

### Step one: Add station iframes inside modal content
Add a new div container inside the modal content. It must have this strucuture:

Replace `uaq` with an ID identifier for the station. This will be used in the button click handler.

```html
 <div class="area uaq">
    <div class="cam viewtype">
        <h3>Camera</h3>
        <!-- ADD WEBCAM SRC URL BELOW -->
        <img src="https://seanssurfreport.com/wp-content/uploads/from_kbc/picture.jpg" class="cam" />
        <button class="refresh btn btn-sm" onclick="handleButtonRefreshClick(event)">
            <svg
                xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
            </svg>
        </button>
    </div>
    <div class="wind viewtype">
        <h3>Wind</h3>
        <div style="max-width: 100%;">

        <!-- ADD WIND IFRAME SCRIPT HERE -->

        </div>
    </div>
    <h3>Forecast</h3>
    <div class="forecast viewtype">
        <div>
        <!-- ADD WIND FORECAST SCRIPT HERE -->
        </div>
    </div>
</div>
              
```

### Step Two: Add Station Card
The landing consists of a grid of UI cards. We need to add a new card for the station, and adjust the button click function to use the new stations ID identifier we created in the step above.

Inside the div container with ID `cards-grid`, add this html snippet, adjusting the following:
- The <h2> headings
- The Station ID inside the `menuItemClick` function
- The external url for the station, if there is one.

```html
    <div class="col">
        <h2 class="text-body-primary fw-bold d-sm-none mb-2 ml-1"> INSERT NAME OF STATION HERE </h2>
        <div class="card shadow-sm is-loading">
            <a href="#" onclick="menuItemClick('INSERT STATION ID HERE', 'cam')">
            <img class="object-fit-cover card-img-top"
                src="INSERT WEB CAM URL HERE" height="225" />
            <button class="refresh btn btn-sm" onclick="handleButtonRefreshClick(event)">
                <svg
                    xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                    <path
                        d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                </svg>
            </button>
            </a>
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="btn-group">
                        <button onclick="setModalContent('INSERT STATION ID HERE', 'cam')" type="button"
                      class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal"
                      data-bs-target="#data-modal">Camera</button>
                        <button onclick="setModalContent('INSERT STATION ID HERE', 'wind')" type="button"
                      class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#data-modal">Live
                      Wind</button>
                        <button onclick="setModalContent('INSERT STATION ID HERE', 'forecast')" type="button"
                      class="btn btn-sm btn-outline-secondary" data-bs-toggle="modal"
                      data-bs-target="#data-modal">Forecast</button>
                    </div>
                    <a href="INSERT EXTERNAL STATION URL HERE" target="_blank" rel="noopener noreferrer">
                        <h2 class="text-body-primary fw-bold d-none d-sm-block">INSERT NAME OF STATION HERE</h2>
                    </a>
                </div>
            </div>
        </div>
    </div>
```

### Step 3: Update Nav Menu
Inside the Nav element, add another list element for the new station:

```html
    <li class="nav-item">
        <a class="nav-link btn" onclick="menuItemClick('INSERT STATION ID HERE', 'cam')"> INSERT NAME OF STATION HERE </a>
    </li>
```

https://jonalport.github.io/seanssurfreport/index.html
--
python3 -m http.server
