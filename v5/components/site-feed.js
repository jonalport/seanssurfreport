class SiteFeed extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>
    :host {
        display: block;
        width: 100%;
        /* Height is omitted to allow natural content-driven sizing */
    }

    .feed-container {
        background-color: #9fc199;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        max-width: 100%; /* Prevents overflow beyond parent */
        /* Height adapts to #community; no explicit height set */
    }

    #community {
        display: flex;
        justify-content: center;
        width: 90%;
        /* Height is driven by .post-preview content; no flex-grow needed */
    }

    .post-preview {
        flex: 1; /* Equal width in row layout */
        margin: 0 5px; /* Horizontal spacing in row layout */
        padding: 5px;
        font-size: 0.9rem;
        text-align: center;
        white-space: nowrap; /* Prevents wrapping in row layout */
        overflow: hidden; /* Hides excess text */
        text-overflow: ellipsis; /* Adds ellipsis for long text */
        display: flex;
        flex-direction: column; /* Stacks <a> and <small> vertically */
        gap: 3px; /* Spacing between <a> and <small> */
    }

    .post-preview a {
        text-decoration: none;
        color: black;
        line-height: 1.2;
    }

    .post-preview a:hover {
        text-decoration: underline;
    }

    .post-preview small {
        display: block;
        color: #808080;
        font-size: 0.8rem;
        line-height: 1.2;
    }

    /* Medium screens: Stack posts vertically */
    @media (max-width: 640px) {
        #community {
            flex-direction: column;
            align-items: center;
            width: auto;
            max-width: 350px; /* Caps width for readability */
            margin: 0 auto; /* Centers the container */
        }

        .post-preview {
            flex: none; /* Disables equal-width behavior */
            width: 100%; /* Full width within #community */
            max-width: 350px;
            margin: 0; /* Removes horizontal margins */
            white-space: normal; /* Allows text wrapping */
            overflow: visible; /* Shows full text */
            text-overflow: clip; /* Removes ellipsis */
            box-sizing: border-box; /* Includes padding in width */
        }
    }

    /* Small screens: Adjust for very narrow viewports */
    @media (max-width: 640px) {
        #community {
            max-width: 100%; /* Full width on small screens */
        }

        .post-preview {
            max-width: 100%; /* Matches #community width */
            font-size: 0.85rem; /* Slightly smaller text */
        }

        .post-preview small {
            font-size: 0.75rem; /* Smaller timestamp */
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
            // Set up a timer to refresh the feed every 5 minutes (300,000 ms)
            this.refreshInterval = setInterval(() => {
                this.fetchDiscoursePosts();
            }, 300000); // 5 minutes
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
                        <small>${new Date(topic.date).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })}</small>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Error fetching Discourse posts:', error);
            this.community.innerHTML = '<p>Unable to load community posts</p>';
        }
    }

    // Clean up the interval when the component is removed
    disconnectedCallback() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

customElements.define('site-feed', SiteFeed);