// site-dash.js
window.loadDashContent = function(main) {
    main.innerHTML = `
        <section>
            <div class="cards-grid">
                ${getDashboardCards()}
            </div>
        </section>
    `;

    // Apply styles programmatically to mirror site-nav.js
    const cards = main.querySelectorAll('.card');
    cards.forEach(card => {
        const bgImage = card.style.backgroundImage || '';
        card.style.cssText = `
            ${bgImage ? `background-image: ${bgImage};` : ''}
            width: 100%;
            aspect-ratio: 2 / 1;
            background-color: #fff;
            border-radius: 8px 8px 0 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            position: relative; /* For positioning widget */
        `;
    });

    // Remove existing dashboard styles if present
    const existingStyle = document.getElementById('dashboard-layout-style');
    if (existingStyle) existingStyle.remove();

    // Add container styles and widget styling
    const style = document.createElement('style');
    style.id = 'dashboard-layout-style';
    style.textContent = `
        body { 
            display: flex; 
            flex-direction: column; 
            min-height: 100vh; 
            margin: 0;
        }
        site-main { 
            flex-grow: 1; 
            display: flex; 
            flex-direction: column; 
        }
        section { 
            width: 90%; 
            margin: 0 auto; 
            padding: 20px 0; 
            flex-grow: 1;
        }
        .cards-grid { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            grid-gap: 20px; 
            width: 100%; 
            margin: 0 auto; 
            flex-grow: 1; /* Make grid stretch to fill section */
            min-height: 0; /* Prevent overflow issues */
        }
        .card-wrapper { 
            width: 100%; 
            display: flex; 
            flex-direction: column; 
            text-decoration: none; 
        }
        .card-text { 
            font-size: 0.9rem; 
            padding: 8px; 
            background-color: #fff; 
            border-radius: 0 0 8px 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
            text-align: center; 
            white-space: nowrap; 
            color: #000; 
        }
        widget-windguru { 
            width: 14%; /* 14% of the card's width */
            aspect-ratio: 1 / 1; /* Maintains square shape */
            position: absolute; 
            bottom: 5%; /* Relative to card height */
            left: 2.5%; /* Relative to card width */
            z-index: 10; /* Above background image */
        }
        site-footer { 
            flex-shrink: 0; 
        }
        @media (max-width: 640px) { 
            .cards-grid { 
                grid-template-columns: 1fr; 
                width: 100%; 
            }
            .card-wrapper { 
                width: 100%; 
            }
        }
    `;
    document.head.appendChild(style);

    // Hide site-nav when loading dashboard
    const nav = document.querySelector('site-nav');
    if (nav) {
        nav.style.display = 'none';
    }

    // Update URL hash
    history.pushState({ page: 'dashboard' }, 'Dashboard', '#dashboard');

    // Add click event listeners to cards
    const cardLinks = main.querySelectorAll('.card-wrapper');
    cardLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Stop default navigation
            const page = link.getAttribute('href').substring(1); // Extract page from /kbc, /bos, etc.
            loadSpotPage(page, main);
        });
    });

    // Inject Windguru widgets
    injectWindguruWidgets();
};

// Function to load spot pages into site-main
function loadSpotPage(page, main) {
    const nav = document.querySelector('site-nav');
    if (!main || !nav) return;

    // Show site-nav for non-dashboard pages
    nav.style.display = '';

    // Remove any existing spot script
    const existingScript = document.getElementById(`spot-script-${page}`);
    if (existingScript) existingScript.remove();

    // Load the new spot script
    const script = document.createElement('script');
    script.src = `components/spot-${page}.js`;
    script.id = `spot-script-${page}`;
    script.onload = () => {
        const loadFunction = window[`load${page.toUpperCase()}Content`];
        if (typeof loadFunction === 'function') {
            loadFunction(main);
        } else {
            console.error(`Function load${page.toUpperCase()}Content not found`);
            main.innerHTML = `<p>Error loading content for ${page}</p>`;
        }
    };
    script.onerror = () => {
        console.error(`Failed to load spot-${page}.js`);
        main.innerHTML = `<p>Error loading content for ${page}</p>`;
    };
    document.body.appendChild(script);

    // Update URL hash
    history.pushState({ page }, `Page ${page}`, `#${page}`);
}

function injectWindguruWidgets() {
    const injectWidget = (spot, uid, index) => {
        if (!spot || !uid || spot === 'blank' || uid === 'blank') return;
        (function (window, document) {
            var loader = function () {
                var arg = [
                    `spot=${spot}`,
                    `uid=${uid}`,
                    "color=light",
                    "wj=knots",
                    "tj=c",
                    "avg_min=0",
                    "gsize=400",
                    "msize=400",
                    "m=3",
                    "arrow=y",
                    "show=n,g,c,f,m"
                ];
                var script = document.createElement("script");
                script.src = "https://www.windguru.cz/js/wglive.php?" + (arg.join("&"));
                script.id = uid;

                const tempContainer = document.createElement('div');
                tempContainer.style.display = 'none';
                document.body.appendChild(tempContainer);
                tempContainer.appendChild(script);

                script.onload = function () {
                    const widgetKbcElements = document.querySelectorAll('widget-windguru');
                    if (widgetKbcElements.length > index) {
                        const widgetContent = script.nextSibling || document.querySelector(`#${uid} + *`);
                        if (widgetContent) {
                            widgetKbcElements[index].innerHTML = '';
                            widgetKbcElements[index].appendChild(widgetContent);
                            widgetContent.style.width = '100%';
                            widgetContent.style.height = '100%';

                            if (script.parentNode === tempContainer) {
                                tempContainer.removeChild(script);
                            }
                            if (tempContainer.parentNode && !tempContainer.children.length) {
                                document.body.removeChild(tempContainer);
                            }
                        }
                    }
                };
            };
            if (document.readyState === 'complete') {
                loader();
            } else {
                window.addEventListener('load', loader, false);
            }
        })(window, document);
    };

    injectWidget('2146', 'wglive_2146_1706848056699', 0); // KBC
    injectWidget('3568', 'wglive_3568_1706847920748', 1); // BOS
    injectWidget('3858', 'wglive_3858_1710779222995', 2); // YAS
    injectWidget('4065', 'wglive_4065_1715855101032', 3); // DOSC
    injectWidget('2014', 'wglive_2014_1713422960240', 4); // SANDY
}

function getDashboardCards() {
    const locations = [
        { image: 'https://worker.seanssurfreport.com/kbc', text: 'Kitesurf Beach Center, UAQ', link: '/kbc' },
        { image: 'https://worker.seanssurfreport.com/bos', text: 'Blue Ocean Sports, Jebel Ali', link: '/bos' },
        { image: 'https://worker.seanssurfreport.com/yas', text: 'Yas Kite Area, Abu Dhabi', link: '/yas' },
        { image: 'https://worker.seanssurfreport.com/dosc', text: 'Dubai Offshore Sailing Club', link: '/dosc' },
        { image: 'https://worker.seanssurfreport.com/sandy', text: 'Sandy Beach Hotel, Dibba', link: '/sandy' },
        { image: './img/offline.jpg', text: 'Mikoko, Umm Al Quwain', link: '/mikoko' }
    ];
    return locations.map(loc => `
        <a href="${loc.link}" class="card-wrapper">
            <div class="card" style="background-image: url('${loc.image}')">
                <widget-windguru></widget-windguru>
            </div>
            <div class="card-text">${loc.text}</div>
        </a>
    `).join('');
}