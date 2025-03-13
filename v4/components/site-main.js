class SiteMain extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
            <section>
                <h2>Main Content</h2>
                <p>This is the main content area that will resize based on content.</p>
            </section>
        `;
    }
}

customElements.define('site-main', SiteMain);