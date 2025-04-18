class SiteMain extends HTMLElement {
    constructor() {
        super();
        // Leave innerHTML empty initially; content will be set dynamically
        this.innerHTML = '';
    }
}

customElements.define('site-main', SiteMain);