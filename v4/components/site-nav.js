class SiteNav extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <div class="nav-container">
                <div class="card-wrapper" data-page="page1">
                    <div class="card" style="background-image: url('https://worker.seanssurfreport.com/kbc')"></div>
                    <div class="card-text">Kitesurf Beach Center, UAQ</div>
                </div>
                <div class="card-wrapper" data-page="page2">
                    <div class="card" style="background-image: url('https://worker.seanssurfreport.com/yas')"></div>
                    <div class="card-text">Yas Kite Area, Abu Dhabi</div>
                </div>
            </div>
        `;

        this.addEventListener('click', this.handleCardClick.bind(this));
    }

    connectedCallback() {
        // Container styles
        this.querySelector('.nav-container').style.cssText = `
            display: flex;
            overflow-x: auto;
            padding: 10px;
            gap: 20px;
            white-space: nowrap;
            height: 100%; /* Fill the site-nav height */
            align-items: stretch;
        `;

        // Wrapper styles (card + text)
        this.querySelectorAll('.card-wrapper').forEach(wrapper => {
            wrapper.style.cssText = `
                flex: 0 0 auto;
                width: 200px; /* Fixed width, adjust as needed */
                height: 100%; /* Fill container height */
                display: flex;
                flex-direction: column;
                cursor: pointer;
            `;
        });

        // Card styles (image only)
        this.querySelectorAll('.card').forEach(card => {
            const bgImage = card.style.backgroundImage || ''; // Preserve inline background-image

            card.style.cssText = `
                ${bgImage ? `background-image: ${bgImage};` : ''}
                flex: 1; /* Take remaining space after text */
                background-color: #fff; /* Fallback color */
                border-radius: 8px 8px 0 0; /* Rounded top only */
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
            `;
        });

        // Text styles
        this.querySelectorAll('.card-text').forEach(text => {
            text.style.cssText = `
                font-size: 0.9rem;    
                padding: 8px;
                background-color: #fff; /* Match card background */
                border-radius: 0 0 8px 8px; /* Rounded bottom only */
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                text-align: center;
                white-space: nowrap;
                color: #000; /* Black text for visibility */
            `;
        });
    }

    handleCardClick(event) {
        const wrapper = event.target.closest('.card-wrapper');
        if (!wrapper) return;

        const page = wrapper.dataset.page;
        this.loadPage(page);
    }

    loadPage(page) {
        history.pushState({ page }, `Page ${page.slice(-1)}`, `#${page}`);

        const main = document.querySelector('site-main');
        if (main) {
            switch(page) {
                case 'page1':
                    main.innerHTML = `
                        <section>
                            <h2>Page 1 Content</h2>
                            <p>This is the unique content for Page 1. Welcome to the first page!</p>
                        </section>
                    `;
                    // Apply centering styles to Page 1
                    main.querySelector('section').style.cssText = `
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        width: 100%;
                        text-align: center;
                        padding: 20px;
                        box-sizing: border-box;
                    `;
                    break;
                case 'page2':
                    main.innerHTML = `
                        <section>
                            <h2>Page 2 Content</h2>
                            <p>This is the unique content for Page 2. Here's something different!</p>
                        </section>
                    `;
                    break;
            }
        }
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
    const hash = window.location.hash.slice(1) || 'page1';
    nav.loadPage(hash);
});