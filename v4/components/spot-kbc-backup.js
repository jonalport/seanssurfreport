function loadKBCContent(main) {
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.body.appendChild(script);
        });
    }

    // Load both location-card.js and tides-forecast.js
    Promise.all([
        loadScript('components/location-card.js'),
        loadScript('components/tides-forecast.js')
    ])
        .then(() => {
            main.innerHTML = `
                <section>
                    <div>
                        <div>
                            <h1>Kitesurf Beach Center, UAQ</h1>
                            <p>Located an hour NE of Dubai in the emirate of Umm Al Quwain, KBC is well located to receive good wind and swell when the conditions align. You will also find a nice community of local riders and some incredible food on the restaurants menu -
                                <a href="https://kitesurfbeachcenter.ae" target="_blank" rel="noopener noreferrer">website</a>
                            </p>
                        </div>
                    </div>

                    <div class="cam viewtype">
                        <h2><a href="/kbc_stream_v2.html">Live Camera</a></h2>
                        <location-card image-url="https://worker.seanssurfreport.com/kbc"></location-card>
                    </div>

                    <div>
                        <h2>Live Wind</h2>
                        <div class="wind viewtype">
                            <div id="wglive_2146_1617178001640" class="windguru-container"></div>
                        </div>

                        <h2>Forecast</h2>
                        <div class="forecast viewtype">
                            <div id="wg_fwdg_687932_100_1617177954510" class="windguru-container"></div>
                        </div>

                        <h2>Tides</h2>
                        <div>
                            <tides-forecast latitude="25.547349437098276" longitude="55.53625122329003"></tides-forecast>
                        </div>
                    </div>
                </section>
            `;

            // Add containment styles to Windguru containers
            const style = document.createElement('style');
            style.textContent = `
                .windguru-container {
                    max-height: 300px; /* Limit iframe height */
                    overflow: hidden; /* Contain overflow */
                    width: 90%; /* Ensure it fits */
                    margin: 0 auto;
                    
                }

                site-main {
                    overflow-y: auto; /* Allow scrolling within main if needed */
                    max-height: calc(83vh - 10px); /* Respect nav and header heights */
                }
            `;
            document.head.appendChild(style);

            // Load Windguru scripts into their containers
            const liveWindContainer = main.querySelector('#wglive_2146_1617178001640');
            if (liveWindContainer && !liveWindContainer.querySelector('script')) {
                const liveWindScript = document.createElement('script');
                liveWindScript.src = 'https://www.windguru.cz/js/wglive.php?spot=2146&uid=wglive_2146_1617178001640&direct=1&wj=knots&tj=c&avg_min=0&gsize=250&msize=300&m=3&show=n,g,c';
                liveWindScript.async = true;
                liveWindContainer.appendChild(liveWindScript);
            }

            const forecastContainer = main.querySelector('#wg_fwdg_687932_100_1617177954510');
            if (forecastContainer && !forecastContainer.querySelector('script')) {
                const forecastScript = document.createElement('script');
                forecastScript.src = 'https://www.windguru.cz/js/widget.php?s=687932&m=100&mw=84&uid=wg_fwdg_687932_100_1617177954510&wj=knots&tj=c&waj=m&odh=0&doh=24&fhours=240&hrsm=2&vt=forecasts&lng=en&idbs=1&p=WINDSPD,GUST,SMER,HTSGW,PERPW,DIRPW,TMPE,CDC,APCP1s';
                forecastScript.async = true;
                forecastContainer.appendChild(forecastScript);
            }
        })
        .catch((error) => {
            console.error(error);
            main.innerHTML = `<p>Error loading location-card or tides-forecast component</p>`;
        });
}