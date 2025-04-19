class SiteNav extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="nav-container">
                <div class="nav-card-wrapper" data-page="kbc" draggable="true">
                    <div class="nav-card" style="background-image: url('https://worker.seanssurfreport.com/kbc')">
                        <widget-windguru></widget-windguru>
                    </div>
                    <div class="nav-card-text">Kitesurf Beach Center, UAQ</div>
                </div>
                <div class="nav-card-wrapper" data-page="bos" draggable="true">
                    <div class="nav-card" style="background-image: url('https://worker.seanssurfreport.com/bos')">
                        <widget-windguru></widget-windguru>
                    </div>
                    <div class="nav-card-text">Blue Ocean Sports, JA</div>
                </div>
                <div class="nav-card-wrapper" data-page="yas" draggable="true">
                    <div class="nav-card" style="background-image: url('https://worker.seanssurfreport.com/yas')">
                        <widget-windguru></widget-windguru>
                    </div>
                    <div class="nav-card-text">Yas Kite Area, Abu Dhabi</div>
                </div>
                <div class="nav-card-wrapper" data-page="dosc" draggable="true">
                    <div class="nav-card" style="background-image: url('https://worker.seanssurfreport.com/dosc')">
                        <widget-windguru></widget-windguru>
                    </div>
                    <div class="nav-card-text">Dubai Offshore Sailing Club</div>
                </div>
                <div class="nav-card-wrapper" data-page="sandy" draggable="true">
                    <div class="nav-card" style="background-image: url('https://worker.seanssurfreport.com/sandy')">
                        <widget-windguru></widget-windguru>
                    </div>
                    <div class="nav-card-text">Sandy Beach Hotel, Dibba</div>
                </div>
                <div class="nav-card-wrapper" data-page="mikoko" draggable="true">
                    <div class="nav-card" style="background-image: url('./img/offline.jpg')">
                        <widget-windguru></widget-windguru>
                    </div>
                    <div class="nav-card-text">Mikoko, UAQ</div>
                </div>
            </div>
        `;

        this.addEventListener('click', this.handleCardClick.bind(this));
        this.setupDragAndDrop();
        this.injectWindguruWidgets();
    }

    connectedCallback() {
        const navContainer = this.querySelector('.nav-container');
        navContainer.style.cssText = `
            display: flex;
            overflow-x: auto;
            padding: 10px 10px;
            gap: 20px;
            white-space: nowrap;
            height: 100%;
            align-items: stretch;
            box-sizing: border-box;
        `;

        const updateAlignment = () => {
            const contentWidth = Array.from(navContainer.querySelectorAll('.nav-card-wrapper'))
                .reduce((total, wrapper) => total + wrapper.offsetWidth + 20, 0) - 20;
            const containerWidth = navContainer.offsetWidth;
            navContainer.style.justifyContent = contentWidth <= containerWidth ? 'center' : 'flex-start';
        };

        navContainer.scrollLeft = 0;
        updateAlignment();
        window.addEventListener('resize', updateAlignment);

        this.querySelectorAll('.nav-card-wrapper').forEach(wrapper => {
            wrapper.style.cssText = `
                flex: 0 0 auto;
                width: 200px;
                height: 100%;
                display: flex;
                flex-direction: column;
                cursor: move;
            `;
        });

        this.querySelectorAll('.nav-card').forEach(card => {
            const bgImage = card.style.backgroundImage || '';
            card.style.cssText = `
                ${bgImage ? `background-image: ${bgImage};` : ''}
                flex: 1;
                background-color: #fff;
                border-radius: 8px 8px 0 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                position: relative;
            `;
        });

        this.querySelectorAll('.nav-card-text').forEach(text => {
            text.style.cssText = `
                font-size: 0.8rem;
                padding: 8px;
                background-color: #fff;
                border-radius: 0 0 8px 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                text-align: center;
                white-space: nowrap;
                color: #000;
            `;
        });

        this.querySelectorAll('widget-windguru').forEach(widget => {
            widget.style.cssText = `
                width: 20%;
                aspect-ratio: 1 / 1;
                position: absolute;
                bottom: 5%;
                left: 2.5%;
                z-index: 10;
            `;
        });
    }

    injectWindguruWidgets() {
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
                        const widgetElements = document.querySelectorAll('widget-windguru');
                        if (widgetElements.length > index) {
                            const widgetContent = script.nextSibling || document.querySelector(`#${uid} + *`);
                            if (widgetContent) {
                                widgetElements[index].innerHTML = '';
                                widgetElements[index].appendChild(widgetContent);
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

    setupDragAndDrop() {
        const container = this.querySelector('.nav-container');
        let draggedItem = null;

        container.addEventListener('dragstart', (e) => {
            const wrapper = e.target.closest('.nav-card-wrapper');
            if (!wrapper) return;
            draggedItem = wrapper;
            setTimeout(() => wrapper.style.opacity = '0.5', 0);
        });

        container.addEventListener('dragend', (e) => {
            if (draggedItem) {
                draggedItem.style.opacity = '1';
                draggedItem = null;
            }
        });

        container.addEventListener('dragover', (e) => e.preventDefault());

        container.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetWrapper = e.target.closest('.nav-card-wrapper');
            if (!targetWrapper || !draggedItem || draggedItem === targetWrapper) return;

            const allWrappers = Array.from(container.querySelectorAll('.nav-card-wrapper'));
            const draggedIndex = allWrappers.indexOf(draggedItem);
            const targetIndex = allWrappers.indexOf(targetWrapper);

            if (draggedIndex < targetIndex) {
                targetWrapper.after(draggedItem);
            } else {
                targetWrapper.before(draggedItem);
            }
        });
    }

    handleCardClick(event) {
        const wrapper = event.target.closest('.nav-card-wrapper');
        if (!wrapper) return;

        const page = wrapper.dataset.page;
        this.loadPage(page);
    }

    loadPage(page) {
        history.pushState({ page }, `Page ${page}`, `#${page}`);
        const main = document.querySelector('site-main');
        const nav = document.querySelector('site-nav');
        if (!main || !nav) return;

        const currentPage = window.location.hash.slice(1);
        const forecastPages = ['kbc', 'bos', 'yas', 'dosc', 'sandy', 'mikoko'];
        if (forecastPages.includes(currentPage) && !forecastPages.includes(page)) {
            if (typeof window.unloadSiteContent === 'function') {
                window.unloadSiteContent();
            }
        }

        if (currentPage === 'community' && page !== 'community') {
            if (typeof window.unloadCommunityContent === 'function') {
                window.unloadCommunityContent();
            }
        }

        if (page === 'dashboard') {
            const existingScript = document.getElementById('site-dash-script');
            if (existingScript) existingScript.remove();

            const script = document.createElement('script');
            script.src = 'components/site-dash.js';
            script.id = 'site-dash-script';
            script.onload = () => {
                if (typeof window.loadDashContent === 'function') {
                    window.loadDashContent(main);
                    window.setSectionVisibility('dashboard');
                } else {
                    console.error('loadDashContent function not found');
                }
            };
            script.onerror = () => {
                console.error('Failed to load site-dash.js');
                main.innerHTML = `<p>Error loading dashboard</p>`;
            };
            document.body.appendChild(script);
        } else if (page === 'community') {
            const existingScript = document.getElementById('site-community-script');
            if (existingScript) existingScript.remove();

            const script = document.createElement('script');
            script.src = 'components/site-community.js';
            script.id = 'site-community-script';
            script.onload = () => {
                if (typeof window.loadCommunityContent === 'function') {
                    window.loadCommunityContent(main);
                    window.setSectionVisibility('community');
                } else {
                    console.error('loadCommunityContent function not found');
                }
            };
            script.onerror = () => {
                console.error('Failed to load site-community.js');
                main.innerHTML = `<p>Error loading community page</p>`;
            };
            document.body.appendChild(script);
        } else {
            const pageType = forecastPages.includes(page) ? 'forecast' : 'unknown';
            window.setSectionVisibility(pageType);
            nav.style.display = pageType === 'forecast' ? '' : 'none';
            this.resetNavLayout();

            const locationMap = {
                'kbc': 'kbc',
                'bos': 'bos',
                'yas': 'yas',
                'dosc': 'dosc',
                'sandy': 'sandy',
                'mikoko': 'mikoko'
            };
            const locationId = locationMap[page] || page;

            const existingScript = document.getElementById('site-forecast-script');
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = 'components/site-forecast.js';
                script.id = 'site-forecast-script';
                script.onload = () => {
                    if (typeof window.loadSiteContent === 'function') {
                        window.loadSiteContent(main, locationId);
                    } else {
                        console.error('loadSiteContent function not found');
                    }
                };
                script.onerror = () => {
                    console.error('Failed to load site-forecast.js');
                    main.innerHTML = `<p>Error loading content for ${page}</p>`;
                };
                document.body.appendChild(script);
            } else if (typeof window.loadSiteContent === 'function') {
                window.loadSiteContent(main, locationId);
            } else {
                console.error('loadSiteContent function not available yet');
                main.innerHTML = `<p>Loading content for ${page}, please wait...</p>`;
            }
        }
    }

    resetNavLayout() {
        const navContainer = this.querySelector('.nav-container');
        navContainer.style.display = 'none';
        void navContainer.offsetHeight;
        navContainer.style.display = 'flex';

        navContainer.style.cssText = `
            display: flex;
            overflow-x: auto;
            padding: 10px 10px;
            gap: 20px;
            white-space: nowrap;
            height: 100%;
            align-items: stretch;
            box-sizing: border-box;
        `;

        this.querySelectorAll('.nav-card-wrapper').forEach(wrapper => {
            wrapper.style.cssText = `
                flex: 0 0 auto;
                width: 200px;
                height: 100%;
                display: flex;
                flex-direction: column;
                cursor: move;
            `;
        });

        this.querySelectorAll('.nav-card').forEach(card => {
            const bgImage = card.style.backgroundImage || '';
            card.style.cssText = `
                ${bgImage ? `background-image: ${bgImage};` : ''}
                flex: 1;
                background-color: #fff;
                border-radius: 8px 8px 0 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                position: relative;
            `;
        });

        this.querySelectorAll('.nav-card-text').forEach(text => {
            text.style.cssText = `
                font-size: 0.8rem;
                padding: 8px;
                background-color: #fff;
                border-radius: 0 0 8px 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                text-align: center;
                white-space: nowrap;
                color: #000;
            `;
        });

        this.querySelectorAll('widget-windguru').forEach(widget => {
            widget.style.cssText = `
                width: 20%;
                aspect-ratio: 1 / 1;
                position: absolute;
                bottom: 5%;
                left: 2.5%;
                z-index: 10;
            `;
        });

        const contentWidth = Array.from(navContainer.querySelectorAll('.nav-card-wrapper'))
            .reduce((total, wrapper) => total + wrapper.offsetWidth + 20, 0) - 20;
        const containerWidth = navContainer.offsetWidth;
        navContainer.style.justifyContent = contentWidth <= containerWidth ? 'center' : 'flex-start';
    }
}

customElements.define('site-nav', SiteNav);

window.addEventListener('popstate', (event) => {
    const nav = document.querySelector('site-nav');
    if (event.state && event.state.page && nav) {
        nav.loadPage(event.state.page);
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('site-nav');
    const hash = window.location.hash.slice(1) || 'dashboard';
    if (nav) {
        nav.loadPage(hash);
    }
});