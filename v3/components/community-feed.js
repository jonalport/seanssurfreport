class CommunityFeed {
    constructor() {
        this.community = document.getElementById('community');
        this.handle = document.getElementById('feed-handle');
        
        if (!this.community || !this.handle) {
            console.error('Community Feed elements not found:', { community: this.community, handle: this.handle });
            return;
        }

        this.setupToggle(); // Set up toggle
        this.init(); // Fetch posts asynchronously
    }

    setupToggle() {
        // Define toggleCommunity globally to match HTML onclick
        window.toggleCommunity = () => {
            console.log('Toggling community section');
            if (this.community.style.height === '' || this.community.style.height === '0px') {
                this.community.style.height = '5vh'; // Expand to show content
            } else {
                this.community.style.height = '0px'; // Collapse fully
            }
        };

        // Ensure the handle uses the global toggle function
        this.handle.onclick = window.toggleCommunity;

        // Set initial state to 5vh on load
        if (!this.community.style.height) {
            this.community.style.height = '5vh'; // Default to 5vh instead of 15vh
        }
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
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            console.log('API Response:', data); // Debug: Log the full response

            // Use the Worker's summarized data directly
            const latestTopics = data.slice(0, 3); // Assuming Worker returns array of 3 posts

            this.community.innerHTML = latestTopics.map(topic => {
                const categoryName = topic.category || 'Uncategorized'; // Use category from Worker
                const titleWords = topic.title.split(' ').slice(0, 6).join(' ');
                return `
                    <div class="post-preview">
                        <a href="${topic.url}" target="_blank">[${categoryName}] ${titleWords}${topic.title.split(' ').length > 6 ? '...' : ''}</a>
                        <small>${new Date(topic.date).toLocaleDateString()}</small>
                    </div>
                `;
            }).join('');

            const style = document.createElement('style');
            style.textContent = `
                .post-preview {
                    margin-bottom: 5px; /* Half of original 10px */
                    font-size: 0.9rem;
                    padding: 2.5px 10px; /* Half height: reduced from 5px to 2.5px */
                    text-align: left;
                }
                .post-preview a {
                    text-decoration: none;
                    color: #fff;
                }
                .post-preview a:hover {
                    text-decoration: underline;
                }
                .post-preview small {
                    display: block;
                    color: #ddd;
                }
            `;
            this.community.appendChild(style);
        } catch (error) {
            console.error('Error fetching Discourse posts:', error);
            this.community.innerHTML = '<p>Unable to load community posts</p>';
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing CommunityFeed');
    new CommunityFeed();
});

export default CommunityFeed;