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
                    align-items: center;
                    width: 100%;
                }

                #community {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    /* No max-height; let it grow with content */
                }

                .post-preview {
                    flex: 1; /* Each post takes equal width */
                    margin: 0 5px; /* Horizontal spacing between posts */
                    font-size: 0.9rem;
                    padding: 2px 5px; /* Reduced from 5px 5px */
                    text-align: center; /* Center-align text */
                    white-space: nowrap; /* Prevent text wrapping */
                    overflow: hidden; /* Hide overflow */
                    text-overflow: ellipsis; /* Add ellipsis for long titles */
                }

                .post-preview a {
                    text-decoration: none;
                    color: black;
                }

                .post-preview a:hover {
                    text-decoration: underline;
                }

                .post-preview small {
                    display: block;
                    color: #808080;
                    font-size: 0.8rem;
                }

                @media (max-width: 992px) {
                    #community {
                        flex-direction: column;
                    }

                    .post-preview {
                        flex: none;
                        width: 100%;
                        max-width: 500px;
                        white-space: normal;
                        overflow: visible;
                        text-overflow: clip;
                        margin: 5px 0;
                        text-align: center;
                        
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