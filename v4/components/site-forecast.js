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
        description: 'On the east coast in Fujairah is a little town called Dibba, which is home to arguably the best surf spot in the country (when it works). I\'s a quiet place with an impressive mountain range and a different ocean which is mostly protected - but depending on certain distant storms - can deliver a good SE swell which hits Tim\'s Reef perfectly.',
        cameraUrl: 'https://worker.seanssurfreport.com/sandy',
        windScriptId: 'wglive_2014_1617178111305',
        windArgs: ["spot=2014", "uid=wglive_2014_1617178111305", "direct=1", "wj=knots", "tj=c", "avg_min=0", "gsize=250", "msize=300", "m=3", "show=n,g,c"],
        forecastScriptId: 'wg_fwdg_875305_3_1617178214856',
        forecastArgs: ["s=875305", "m=100", "mw=84", "uid=wg_fwdg_875305_3_1617178214856", "wj=knots", "tj=c", "waj=m", "odh=0", "doh=24", "fhours=240", "hrsm=2", "vt=forecasts", "lng=en", "idbs=1", "p=WINDSPD,GUST,SMER,HTSGW,PERPW,DIRPW,TMPE,CDC,APCP1s"]
    },
    'mikoko': {
        name: 'Mikoko, UAQ',
        description: 'Situated in Umm Al Quwain, Mikoko is a luxurious oasis in the heart of the mangrove forests. This is a flatwater spot that is good for kiting but can tricky on very low tides. There are chalets on the waters edge and a restaurant with an upstairs viewing deck - <a href="https://casamikoko.ae" target="_blank" rel="noopener noreferrer">website</a>',
        cameraUrl: 'https://worker.seanssurfreport.com/mikoko',
        windScriptId: 'wglive_3568_1668852175054',
        windArgs: ["spot=3568", "uid=wglive_3568_1668852175054", "direct=1", "wj=knots", "tj=c", "avg_min=0", "gsize=250", "msize=300", "m=3", "show=n,g,c"],
        forecastScriptId: 'wg_fwdg_1136989_3_1668852348455',
        forecastArgs: ["s=1136989", "m=100", "mw=84", "uid=wg_fwdg_bos_67890", "wj=knots", "tj=c", "waj=m", "odh=0", "doh=24", "fhours=240", "hrsm=2", "vt=forecasts", "lng=en", "idbs=1", "p=WINDSPD,GUST,SMER,HTSGW,PERPW,DIRPW,TMPE,CDC,APCP1s"]
    },
};

// Main function to load content based on location
window.loadSiteContent = function(main, locationId) {
    const location = locations[locationId];
    if (!location) {
        main.innerHTML = '<p>Location not found.</p>';
        return;
    }

    // Set the HTML content
    main.innerHTML = `
        <section>
            <div id="info" class="content-block"><h1>${location.name}</h1><p>${location.description}</p></div>
            <div id="camera-title" class="content-block title-block"><div class="title-content">Live Camera</div></div>
            <div id="camera-image" class="content-block"><location-card image-url="${location.cameraUrl}"></location-card></div>
            <div id="wind-title" class="content-block title-block"><div class="title-content">Live Wind</div></div>
            <div id="wind-graph" class="content-block"><div style="max-width: 100%;"></div></div>
            <div id="forecast-title" class="content-block title-block"><div class="title-content">Forecast</div></div>
            <div id="forecast-graph" class="content-block"><div style="max-width: 100%;"></div></div>
        </section>
    `;

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
            .content-block > div:not(.title-content) { width: 100%; max-width: 600px; text-align: center; margin-bottom: 10px; }
            .content-block > div:last-child { margin-bottom: 0; }
            .title-block { font-size: 0.9rem; font-weight: 400; padding: 5px; }
            .title-content { background-color: #000; color: #fff; display: inline-block; padding: 5px 15px; border-radius: 50px; width: auto; line-height: 1; white-space: nowrap; font-family: 'Roboto', sans-serif; }
            p { font-size: 0.95rem; text-align: center; width: 95%; }
            #wind-graph { width: 100%; margin: 0 auto; }
            #wind-graph iframe { border: 0 solid #000 !important; }
            #forecast-graph { width: %; margin: 0 auto; }
        `;
        document.head.appendChild(style);
    }
};

// Cleanup function to remove forecast-specific styles and scripts
window.unloadSiteContent = function() {
    // Remove the forecast styles
    const forecastStyles = document.getElementById('site-forecast-styles');
    if (forecastStyles) forecastStyles.remove();

    // Optionally, clean up Windguru scripts if they're still in the DOM
    const windScripts = document.querySelectorAll('script[id^="wglive_"]');
    windScripts.forEach(script => script.remove());
    const forecastScripts = document.querySelectorAll('script[id^="wg_fwdg_"]');
    forecastScripts.forEach(script => script.remove());
};