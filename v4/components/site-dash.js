window.loadDashContent = function(main) {
    // Full reset: Clear content and styles
    main.innerHTML = '';
    main.removeAttribute('style');

    // Remove all non-dashboard styles to prevent conflicts
    document.querySelectorAll('style:not(#dashboard-layout-style)').forEach(style => style.remove());

    // Load dashboard content
    main.innerHTML = `
        <section>
            <div class="dash-card-grid">
                ${getDashboardCards()}
            </div>
        </section>
    `;

    // Apply styles programmatically to dash-card elements
    const dashCards = main.querySelectorAll('.dash-card');
    dashCards.forEach(card => {
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
            position: relative;
            margin: 0;
            padding: 0;
        `;
    });

    // Reset styles on .dash-card-wrapper and make clickable
    const dashCardWrappers = main.querySelectorAll('.dash-card-wrapper');
    dashCardWrappers.forEach(wrapper => {
        wrapper.style.cssText = `
            width: 100%;
            display: flex;
            flex-direction: column;
            margin: 0;
            padding: 0;
            height: auto;
        `;
    });

    // Remove existing dashboard styles if present
    const existingStyle = document.getElementById('dashboard-layout-style');
    if (existingStyle) existingStyle.remove();

    // Add container styles with explicit resets and clickable styling
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
            margin: 0;
            padding: 0;
        }
        section { 
            width: 90%;
            margin: 2vh auto; 
            flex-grow: 1;
            padding: 0;
        }
        .dash-card-grid { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            gap: 2vh;
            width: 100%; 
            margin: 0 auto;
            padding: 0;
            flex-grow: 1;
            min-height: 0;
        }
        .dash-card-wrapper { 
            width: 100%; 
            display: flex; 
            flex-direction: column; 
            margin: 0; 
            padding: 0; 
            height: auto;
        }
        .dash-card-link {
            text-decoration: none;
            color: inherit;
            display: block;
        }
        .dash-card-link:hover .dash-card {
            opacity: 0.9;
        }
        .dash-card { 
            width: 100%;
            aspect-ratio: 2 / 1;
            margin: 0;
            padding: 0;
            flex-grow: 0;
            flex-shrink: 0;
            cursor: pointer;
        }
        .dash-card-text { 
            font-size: 0.9rem; 
            padding: 8px; 
            background-color: #fff; 
            border-radius: 0 0 8px 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
            text-align: center; 
            white-space: nowrap; 
            color: #000; 
            margin: 0;
            flex-grow: 0;
            flex-shrink: 0;
        }
        widget-windguru { 
            width: 14%;
            aspect-ratio: 1 / 1;
            position: absolute; 
            bottom: 5%;
            left: 2.5%;
            z-index: 10;
        }
        site-footer { 
            flex-shrink: 0; 
        }
        @media (max-width: 640px) { 
            .dash-card-grid { 
                grid-template-columns: 1fr; 
                width: 100%;
                gap: 2vh;
            }
            .dash-card-wrapper { 
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

    // Inject Windguru widgets
    injectWindguruWidgets();

    // Add click event listeners for navigation
    const dashCardLinks = main.querySelectorAll('.dash-card-link');
    dashCardLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const page = link.getAttribute('href').substring(1);
            const navComponent = document.querySelector('site-nav');
            if (navComponent && typeof navComponent.loadPage === 'function') {
                navComponent.loadPage(page);
            }
        });
    });

    // Auto-refresh the dashboard every 60 seconds
    setInterval(() => {
        main.innerHTML = `
            <section>
                <div class="dash-card-grid">
                    ${getDashboardCards()}
                </div>
            </section>
        `;
        // Re-apply styles to the new dash-card elements
        const newDashCards = main.querySelectorAll('.dash-card');
        newDashCards.forEach(card => {
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
                position: relative;
                margin: 0;
                padding: 0;
            `;
        });
        // Re-apply styles to the new dash-card-wrapper elements
        const newDashCardWrappers = main.querySelectorAll('.dash-card-wrapper');
        newDashCardWrappers.forEach(wrapper => {
            wrapper.style.cssText = `
                width: 100%;
                display: flex;
                flex-direction: column;
                margin: 0;
                padding: 0;
                height: auto;
            `;
        });
        // Re-inject Windguru widgets
        injectWindguruWidgets();
        // Re-attach click event listeners
        const newDashCardLinks = main.querySelectorAll('.dash-card-link');
        newDashCardLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault();
                const page = link.getAttribute('href').substring(1);
                const navComponent = document.querySelector('site-nav');
                if (navComponent && typeof navComponent.loadPage === 'function') {
                    navComponent.loadPage(page);
                }
            });
        });
    }, 60000); // 60,000 milliseconds = 60 seconds
};

// Keep the injectWindguruWidgets and getDashboardCards functions as they are
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
 rach                    }
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
        { image: 'https://worker.seanssurfreport.com/kbc', text: 'Kitesurf Beach Center, UAQ', page: 'kbc' },
        { image: 'https://worker.seanssurfreport.com/bos', text: 'Blue Ocean Sports, Jebel Ali', page: 'bos' },
        { image: 'https://worker.seanssurfreport.com/yas', text: 'Yas Kite Area, Abu Dhabi', page: 'yas' },
        { image: 'https://worker.seanssurfreport.com/dosc', text: 'Dubai Offshore Sailing Club', page: 'dosc' },
        { image: 'https://worker.seanssurfreport.com/sandy', text: 'Sandy Beach Hotel, Dibba', page: 'sandy' },
        { image: './img/offline.jpg', text: 'Mikoko, Umm Al Quwain', page: 'mikoko' }
    ];
    return locations.map(loc => `
        <a href="#${loc.page}" class="dash-card-link">
            <div class="dash-card-wrapper">
                <div class="dash-card" style="background-image: url('${loc.image}')">
                    <widget-windguru></widget-windguru>
                </div>
                <div class="dash-card-text">${loc.text}</div>
            </div>
        </a>
    `).join('');
}