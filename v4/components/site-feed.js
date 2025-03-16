class SiteFeed extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
    :host {
        display: block;
        width: 100%;
    }

    .feed-container {
        background-color: #9fc199;
        padding: 5px;
        display: flex;
        flex-direction: column;
        align-items: center; /* Ensure centering of children */
        width: 100%;
        max-width: 100%; /* Prevent overflow */
    }

    #community {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .post-preview {
        flex: 1; /* Each post takes equal width */
        margin: 0 5px; /* Horizontal spacing between posts */
        font-size: 0.9rem;
        padding: 5px; /* Increased padding for better spacing */
        text-align: center; /* Center-align text */
        white-space: nowrap; /* Prevent text wrapping */
        overflow: hidden; /* Hide overflow */
        text-overflow: ellipsis; /* Add ellipsis for long titles */
        display: flex; /* Use flexbox to control internal layout */
        flex-direction: column; /* Stack <a> and <small> vertically */
        gap: 3px; /* Space between <a> and <small> */
    }

    .post-preview a {
        text-decoration: none;
        color: black;
        line-height: 1.2; /* Ensure consistent line height */
    }

    .post-preview a:hover {
        text-decoration: underline;
    }

    .post-preview small {
        display: block;
        color: #808080;
        font-size: 0.8rem;
        line-height: 1.2; /* Consistent line height */
    }

    @media (max-width: 800px) {
        #community {
            flex-direction: column;
            align-items: center; /* Center .post-preview elements horizontally */
            gap: 8px; /* Add spacing between stacked posts */
            width: auto; /* Allow width to adjust based on content */
            max-width: 350px; /* Limit width to prevent excessive stretching */
            margin: 0 auto; /* Center the #community container itself */
        }

        .post-preview {
            flex: none;
            width: 100%; /* Take full width of #community */
            max-width: 350px; /* Limit width for readability */
            white-space: normal; /* Allow text wrapping */
            overflow: visible;
            text-overflow: clip;
            margin: 0; /* Remove horizontal margins */
            text-align: center;
            box-sizing: border-box; /* Ensure padding doesn’t affect width */
        }
    }

    /* Additional media query for very small screens */
    @media (max-width: 400px) {
        .post-preview {
            max-width: 100%; /* Take full width on very small screens */
            font-size: 0.85rem; /* Slightly smaller font */
        }

        .post-preview small {
            font-size: 0.75rem;
        }https://station.windguru.cz/?id=2146

        #community {
            max-width: 100%; /* Ensure full width on very small screens */
        }
    }
</style>

            <div class="feed-container">
                <div id="community"></div>
            </div>
        `;

        this.community = this.shadowRoot.querySelector('#community');
        this.init();
    }

    async init() {
        try {
            await this.fetchDiscoursePosts();
        } catch (error) {
            console.error('Failed to initialize Community Feed:', error);
            this.community.innerHTML = '<p>Unable to load community posts</p>';
        }
    }

    async fetchDiscoursePosts() {
        try {
            const response = await fetch('https://community-feed-proxy.seanssurfreport.workers.dev', {
                method: 'GET',
                headers: { 'Accept': 'application/json' }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API Response:', data);

            const latestTopics = data.slice(0, 3);

            this.community.innerHTML = latestTopics.map(topic => {
                const categoryName = topic.category || 'Uncategorized';
                const titleWords = topic.title.split(' ').slice(0, 6).join(' ');
                return `
                    <div class="post-preview">
                        <a href="${topic.url}" target="_blank">[${categoryName}] ${titleWords}${topic.title.split(' ').length > 6 ? '...' : ''}</a>
                        <small>${new Date(topic.date).toLocaleDateString()}</small>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Error fetching Discourse posts:', error);
            this.community.innerHTML = '<p>Unable to load community posts</p>';
        }
    }
}

customElements.define('site-feed', SiteFeed);