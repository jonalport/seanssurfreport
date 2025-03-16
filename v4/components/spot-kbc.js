// Attach the loadKBCContent function to the global window object for accessibility
window.loadKBCContent = function(main) {
    // Set the HTML structure with nine blocks, adding location-card to camera-image
    main.innerHTML = `
        <section>
            <div id="info" class="content-block"><h1>Kitesurf Beach Center, UAQ</h1><p>Located an hour NE of Dubai in the emirate of Umm Al Quwain, KBC is well located to receive good wind and swell when the conditions align. You will also find a nice community of local riders and some incredible food on the restaurants menu -
                                <a href="https://kitesurfbeachcenter.ae" target="_blank" rel="noopener noreferrer">website</a>
                            </p></div>
            <div id="camera-title" class="content-block title-block"><div class="title-content">Live Camera</div></div>
            <div id="camera-image" class="content-block">
                <location-card image-url="https://worker.seanssurfreport.com/kbc"></location-card>
            </div>
            <div id="wind-title" class="content-block title-block"><div class="title-content">Live Wind</div></div>
            <div id="wind-graph" class="content-block"></div>
            <div id="forecast-title" class="content-block title-block"><div class="title-content">Forecast</div></div>
            <div id="forecast-graph" class="content-block"></div>
            <div id="tide-title" class="content-block title-block"><div class="title-content">Tides</div></div>
            <div id="tide-graph" class="content-block"></div>
        </section>
    `;

    // Add styles for the content blocks and their children
    const style = document.createElement('style');
    style.textContent = `
        .content-block {
            width: 100%; /* Occupy 100% of the parent width */
            display: flex; /* Use flexbox for centering content */
            flex-direction: column; /* Stack children vertically */
            justify-content: center; /* Center content horizontally (for flex-direction: column, this applies to vertical alignment) */
            align-items: center; /* Center content horizontally */
            height: auto; /* Height adjusts based on content */
            box-sizing: border-box; /* Include padding/borders in width */
            padding: 10px; /* Optional: Add some padding for spacing */
        }

        /* Style direct child divs inside content-block, excluding title-content */
        .content-block > div:not(.title-content) {
            width: 100%; /* Ensure child divs take full width of the block (or adjust as needed) */
            max-width: 600px; /* Optional: Limit the width of child divs for better readability */
            text-align: center; /* Center text inside child divs */
            margin-bottom: 10px; /* Add spacing between stacked divs */
        }

        /* Remove margin-bottom from the last child to avoid extra spacing */
        .content-block > div:last-child {
            margin-bottom: 0;
        }

        section {
            width: 100%; /* Ensure the section takes full width */
            display: flex; /* Use flexbox to stack blocks */
            flex-direction: column; /* Stack blocks vertically */
            gap: 10px; /* Add spacing between blocks */
        }

        .title-block {
            font-size: 0.9rem; /* Larger font size */
            font-weight: 500; /* Medium font weight */
            padding: 5px; /* More padding for emphasis */
        }

        /* Style the wrapper for title content to apply the background */
        .title-content {
            background-color: black;
            color: white;
            display: inline-block; /* Width adjusts to content */
            padding: 5px 15px; /* Reduced horizontal padding for a tighter fit */
            border-radius: 50px; /* Rounded corners */
            width: auto; /* Explicitly set to auto to ensure it fits content */
            line-height: 1; /* Normalize line-height to avoid extra spacing */
            white-space: nowrap; /* Prevent text wrapping that could increase width */
            font-family: 'Roboto', sans-serif; /* Match the font family for consistency */
        }

        p {
            font-size: 0.9rem;
            text-align: center;
            width: 90%;
        }
    `;
    document.head.appendChild(style);
};