class SiteNav extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="nav-container">
                <div class="card-wrapper" data-page="kbc" draggable="true">
                    <div class="card" style="background-image: url('https://worker.seanssurfreport.com/kbc')"></div>
                    <div class="card-text">Kitesurf Beach Center, UAQ</div>
                </div>
                <div class="card-wrapper" data-page="bos" draggable="true">
                    <div class="card" style="background-image: url('https://worker.seanssurfreport.com/bos')"></div>
                    <div class="card-text">Blue Ocean Sports, JA</div>
                </div>
                <div class="card-wrapper" data-page="yas" draggable="true">
                    <div class="card" style="background-image: url('https://worker.seanssurfreport.com/yas')"></div>
                    <div class="card-text">Yas Kite Area, Abu Dhabi</div>
                </div>
                <div class="card-wrapper" data-page="dosc" draggable="true">
                    <div class="card" style="background-image: url('https://worker.seanssurfreport.com/dosc')"></div>
                    <div class="card-text">Dubai Offshore Sailing Club</div>
                </div>
                <div class="card-wrapper" data-page="sandy" draggable="true">
                    <div class="card" style="background-image: url('https://worker.seanssurfreport.com/sandy')"></div>
                    <div class="card-text">Sandy Beach Hotel, Dibba</div>
                </div>
                <div class="card-wrapper" data-page="mikoko" draggable="true">
                    <div class="card" style="background-image: url('https://worker.seanssurfreport.com/mikoko')"></div>
                    <div class="card-text">Mikoko, UAQ</div>
                </div>
            </div>
        `;

        this.addEventListener('click', this.handleCardClick.bind(this));
        this.setupDragAndDrop();
    }

    connectedCallback() {
        const navContainer = this.querySelector('.nav-container');
        navContainer.style.cssText = `
            display: flex;
            overflow-x: auto;
            padding: 10px 10px;  /* Consistent padding on all sides */
            gap: 20px;
            white-space: nowrap;
            height: 100%;
            align-items: stretch;
            box-sizing: border-box; /* Ensure padding doesn't increase width */
        `;
    
        // Dynamically adjust justify-content based on content width vs container width
        const updateAlignment = () => {
            const contentWidth = Array.from(navContainer.querySelectorAll('.card-wrapper'))
                .reduce((total, wrapper) => total + wrapper.offsetWidth + 20, 0) - 20; // Account for gap
            const containerWidth = navContainer.offsetWidth;
            
            if (contentWidth <= containerWidth) {
                navContainer.style.justifyContent = 'center'; // Center when content fits
            } else {
                navContainer.style.justifyContent = 'flex-start'; // Align left when overflowing
            }
        };
    
        // Set initial scroll position to left
        navContainer.scrollLeft = 0;
    
        // Update alignment on load and resize
        updateAlignment();
        window.addEventListener('resize', updateAlignment);
    
        // Styles for card-wrapper, card, and card-text remain the same
        this.querySelectorAll('.card-wrapper').forEach(wrapper => {
            wrapper.style.cssText = `
                flex: 0 0 auto;
                width: 200px;
                height: 100%;
                display: flex;
                flex-direction: column;
                cursor: move;
            `;
        });
    
        this.querySelectorAll('.card').forEach(card => {
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
            `;
        });
    
        this.querySelectorAll('.card-text').forEach(text => {
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
    }

    setupDragAndDrop() {
        const container = this.querySelector('.nav-container');
        let draggedItem = null;

        container.addEventListener('dragstart', (e) => {
            const wrapper = e.target.closest('.card-wrapper');
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
            const targetWrapper = e.target.closest('.card-wrapper');
            if (!targetWrapper || !draggedItem || draggedItem === targetWrapper) return;

            const allWrappers = Array.from(container.querySelectorAll('.card-wrapper'));
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
        const wrapper = event.target.closest('.card-wrapper');
        if (!wrapper) return;

        const page = wrapper.dataset.page;
        this.loadPage(page);
    }

    loadPage(page) {
    history.pushState({ page }, `Page ${page}`, `#${page}`);
    const main = document.querySelector('site-main');
    if (!main) return;

    const existingScript = document.getElementById(`spot-script-${page}`);
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.src = `components/spot-${page}.js`;
    script.id = `spot-script-${page}`;
    console.log(`Loading script: ${script.src}`); // Debug line
    script.onload = () => {
        const loadFunction = window[`load${page.toUpperCase()}Content`];
        if (typeof loadFunction === 'function') {
            loadFunction(main);
        } else {
            console.error(`Function load${page.toUpperCase()}Content not found`);
        }
    };
    script.onerror = () => {
        console.error(`Failed to load script for ${page}`);
        main.innerHTML = `<p>Error loading content for ${page}</p>`;
    };
    document.body.appendChild(script);
}
}

customElements.define('site-nav', SiteNav);

window.addEventListener('popstate', (event) => {
    const nav = document.querySelector('site-nav');
    if (event.state && event.state.page) {
        nav.loadPage(event.state.page);
    }
});

window.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('site-nav');
    const hash = window.location.hash.slice(1) || 'kbc';
    nav.loadPage(hash);
});