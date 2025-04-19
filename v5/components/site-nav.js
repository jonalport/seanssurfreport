class SiteNav extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="nav-container">
                <div class="nav-card-wrapper" data-page="kbc" draggable="true">
                    <div class="nav-card" style="background-image: url('https://worker.seanssurfreport.com/kbc')">
                        <widget-windguru class="nav-widget"></widget-windguru>
                    </div>
                    <div class="nav-card-text">Kitesurf Beach Center, UAQ</div>
                </div>
                <div class="nav-card-wrapper" data-page="bos" draggable="true">
                    <div class="nav-card" style="background-image: url('https://worker.seanssurfreport.com/bos')">
                        <widget-windguru class="nav-widget"></widget-windguru>
                    </div>
                    <div class="nav-card-text">Blue Ocean Sports, JA</div>
                </div>
                <div class="nav-card-wrapper" data-page="yas" draggable="true">
                    <div class="nav-card" style="background-image: url('https://worker.seanssurfreport.com/yas')">
                        <widget-windguru class="nav-widget"></widget-windguru>
                    </div>
                    <div class="nav-card-text">Yas Kite Area, Abu Dhabi</div>
                </div>
                <div class="nav-card-wrapper" data-page="dosc" draggable="true">
                    <div class="nav-card" style="background-image: url('https://worker.seanssurfreport.com/dosc')">
                        <widget-windguru class="nav-widget"></widget-windguru>
                    </div>
                    <div class="nav-card-text">Dubai Offshore Sailing Club</div>
                </div>
                <div class="nav-card-wrapper" data-page="sandy" draggable="true">
                    <div class="nav-card" style="background-image: url('https://worker.seanssurfreport.com/sandy')">
                        <widget-windguru class="nav-widget"></widget-windguru>
                    </div>
                    <div class="nav-card-text">Sandy Beach Hotel, Dibba</div>
                </div>
                <div class="nav-card-wrapper" data-page="mikoko" draggable="true">
                    <div class="nav-card" style="background-image: url('./img/offline.jpg')">
                        <widget-windguru class="nav-widget"></widget-windguru>
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
            justify-content: center; /* Default to center */
        `;

        const updateAlignment = () => {
            const contentWidth = Array.from(navContainer.querySelectorAll('.nav-card-wrapper'))
                .reduce((total, wrapper) => total + wrapper.offsetWidth + 20, 0) - 20;
            const containerWidth = navContainer.offsetWidth;
            // Only switch to flex-start if content overflows
            navContainer.style.justifyContent = contentWidth > containerWidth ? 'flex-start' : 'center';
        };

        // Wait for images to load before checking alignment
        const images = this.querySelectorAll('.nav-card');
        let loadedImages = 0;
        const totalImages = images.length;

        const checkAlignment = () => {
            requestAnimationFrame(() => {
                navContainer.scrollLeft = 0;
                updateAlignment();
            });
        };

        if (totalImages === 0) {
            checkAlignment(); // No images to wait for
        } else {
            images.forEach(img => {
                // Create a temporary image to listen for load events
                const tempImg = new Image();
                const bgImage = img.style.backgroundImage.slice(5, -2); // Extract URL from `url('...')`
                tempImg.src = bgImage;
                tempImg.onload = tempImg.onerror = () => {
                    loadedImages++;
                    if (loadedImages === totalImages) {
                        checkAlignment();
                    }
                };
            });
        }

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

        this.querySelectorAll('widget-windguru.nav-widget').forEach(widget => {
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
        const widgetElements = this.querySelectorAll('widget-windguru.nav-widget');
        console.log(`Site-nav widget elements found: ${widgetElements.length}`);
        // Use unique IDs for site-nav widgets to avoid conflicts with dashboard
        window.injectWindguruWidget('2146', 'wglive_2146_nav_1706848056699', 0, widgetElements); // KBC
        window.injectWindguruWidget('3568', 'wglive_3568_nav_1706847920748', 1, widgetElements); // BOS
        window.injectWindguruWidget('3858', 'wglive_3858_nav_1710779222995', 2, widgetElements); // YAS
        window.injectWindguruWidget('4065', 'wglive_4065_nav_1715855101032', 3, widgetElements); // DOSC
        window.injectWindguruWidget('2014', 'wglive_2014_nav_1713422960240', 4, widgetElements); // SANDY
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
            // Clear site-nav widget content when navigating away
            this.querySelectorAll('widget-windguru.nav-widget').forEach(widget => {
                widget.innerHTML = '';
            });
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
            // Clear site-nav widget content
            this.querySelectorAll('widget-windguru.nav-widget').forEach(widget => {
                widget.innerHTML = '';
            });
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
            // Clear site-nav widget content
            this.querySelectorAll('widget-windguru.nav-widget').forEach(widget => {
                widget.innerHTML = '';
            });
        } else {
            const pageType = forecastPages.includes(page) ? 'forecast' : 'unknown';
            window.setSectionVisibility(pageType);
            nav.style.display = pageType === 'forecast' ? '' : 'none';
            this.resetNavLayout();
            // Re-inject widgets when displaying site-nav
            if (pageType === 'forecast') {
                this.injectWindguruWidgets();
            }

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
        navContainer.style.cssText = `
            display: flex;
            overflow-x: auto;
            padding: 10px 10px;
            gap: 20px;
            white-space: nowrap;
            height: 100%;
            align-items: stretch;
            box-sizing: border-box;
            justify-content: center; /* Default to center */
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

        this.querySelectorAll('widget-windguru.nav-widget').forEach(widget => {
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