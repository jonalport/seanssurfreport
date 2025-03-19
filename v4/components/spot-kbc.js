window.loadKBCContent = function(main) {
    main.innerHTML = `
        <section>
            <div id="info" class="content-block"><h1>Kitesurf Beach Center, UAQ</h1><p>Located an hour NE of Dubai in the emirate of Umm Al Quwain, KBC is well located to receive good wind and swell when the conditions align. You will also find a nice community of local riders and some incredible food on the restaurants menu - <a href="https://kitesurfbeachcenter.ae" target="_blank" rel="noopener noreferrer">website</a></p></div>
            <div id="camera-title" class="content-block title-block"><div class="title-content">Live Camera</div></div>
            <div id="camera-image" class="content-block"><location-card image-url="https://worker.seanssurfreport.com/kbc"></location-card></div>
            <div id="wind-title" class="content-block title-block"><div class="title-content">Live Wind</div></div>
            <div id="wind-graph" class="content-block"><div style="max-width: 100%;"></div></div>
            <div id="forecast-title" class="content-block title-block"><div class="title-content">Forecast</div></div>
            <div id="forecast-graph" class="content-block"><div style="max-width: 100%;"></div></div>
            <div id="tide-title" class="content-block title-block"><div class="title-content">Tides</div></div>
            <div id="tide-graph" class="content-block"></div>
        </section>
    `;

    // Clean up previous Windguru scripts
    const windGraph = main.querySelector('#wind-graph div');
    const forecastGraph = main.querySelector('#forecast-graph div');
    const existingWindScript = document.getElementById('wglive_2146_1617178001640');
    const existingForecastScript = document.getElementById('wg_fwdg_687932_100_1617177954510');
    if (existingWindScript) existingWindScript.remove();
    if (existingForecastScript) existingForecastScript.remove();

    // Add the Windguru live wind script programmatically
    const windScript = document.createElement('script');
    windScript.id = 'wglive_2146_1617178001640';
    windScript.textContent = `
        (function (window, document) {
            var loader = function () {
                var arg = ["spot=2146", "uid=wglive_2146_1617178001640", "direct=1", "wj=knots", "tj=c", "avg_min=0", "gsize=250", "msize=300", "m=3", "show=n,g,c"];
                var script = document.createElement("script");
                var tag = document.getElementsByTagName("script")[0];
                script.src = "https://www.windguru.cz/js/wglive.php?" + (arg.join("&"));
                tag.parentNode.insertBefore(script, tag);
            };
            loader(); // Execute immediately
        })(window, document);
    `;
    windGraph.appendChild(windScript);

    // Add the Windguru forecast script programmatically
    const forecastScript = document.createElement('script');
    forecastScript.id = 'wg_fwdg_687932_100_1617177954510';
    forecastScript.textContent = `
        (function (window, document) {
            var loader = function () {
                var arg = ["s=687932", "m=100", "mw=84", "uid=wg_fwdg_687932_100_1617177954510", "wj=knots", "tj=c", "waj=m", "odh=0", "doh=24", "fhours=240", "hrsm=2", "vt=forecasts", "lng=en", "idbs=1", "p=WINDSPD,GUST,SMER,HTSGW,PERPW,DIRPW,TMPE,CDC,APCP1s"];
                var script = document.createElement("script");
                var tag = document.getElementsByTagName("script")[0];
                script.src = "https://www.windguru.cz/js/widget.php?" + (arg.join("&"));
                tag.parentNode.insertBefore(script, tag);
            };
            loader(); // Execute immediately
        })(window, document);
    `;
    forecastGraph.appendChild(forecastScript);

    const style = document.createElement('style');
    style.textContent = `
        section {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .content-block {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: auto;
            box-sizing: border-box;
        }
        .content-block > div:not(.title-content) {
            width: 100%;
            max-width: 600px;
            text-align: center;
            margin-bottom: 10px;
        }
        .content-block > div:last-child {
            margin-bottom: 0;
        }
        .title-block {
            font-size: 0.9rem;
            font-weight: 400;
            padding: 5px;
        }
        .title-content {
            background-color: #000;
            color: #fff;
            display: inline-block;
            padding: 5px 15px;
            border-radius: 50px;
            width: auto;
            line-height: 1;
            white-space: nowrap;
            font-family: 'Roboto', sans-serif;
        }
        p {
            font-size: 0.95rem;
            text-align: center;
            width: 90%;
        }
        #wind-graph {
            width: 90%;
            margin: 0 auto;
        }
        #forecast-graph {
            width: 90%;
            margin: 0 auto;
        }
    `;
    document.head.appendChild(style);
};