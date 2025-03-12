class CommunityFeed {
    constructor() {
        this.community = document.getElementById('community');
        this.handle = document.getElementById('feed-handle');
        
        if (!this.community || !this.handle) {
            console.error('Community Feed elements not found:', { community: this.community, handle: this.handle });
            return;
        }

        this.setupToggle();
        this.init();
    }

    setupToggle() {
        window.toggleCommunity = () => {
            console.log('Toggling community section');
            if (this.community.style.maxHeight === '' || this.community.style.maxHeight === '0px') {
                this.community.style.maxHeight = '500px'; // Expand to allow full content
            } else {
                this.community.style.maxHeight = '0px'; // Collapse fully
            }
        };
        this.handle.onclick = window.toggleCommunity;
        if (!this.community.style.maxHeight) {
            this.community.style.maxHeight = '500px'; // Default to open
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

            const style = document.createElement('style');
style.textContent = `
    .post-preview {
        flex: 1; /* Each post takes equal width */
        margin: 0 5px; /* Horizontal spacing between posts */
        font-size: 0.9rem;
        padding: 5px 5px; /* Reduced horizontal padding for fit */
        text-align: center; /* Center-align text */
        white-space: nowrap; /* Prevent text wrapping */
        overflow: hidden; /* Hide overflow */
        text-overflow: ellipsis; /* Add ellipsis for long titles */
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
        font-size: 0.8rem; /* Smaller date for fit */
    }
    /* Stack adjustments at 992px and below */
    @media (max-width: 992px) {
        .post-preview {
            flex: none; /* Remove equal width constraint */
            width: 100%; /* Full width for stacking */
            max-width: 500px; /* Optional: limit width for readability */
            white-space: normal; /* Allow text to wrap */
            overflow: visible; /* Show full content */
            text-overflow: clip; /* Remove ellipsis */
            margin: 5px 0; /* Vertical spacing instead of horizontal */
            text-align: center; /* Ensure center alignment persists */
        }
    }
`;
this.community.appendChild(style);
        } catch (error) {
            console.error('Error fetching Discourse posts:', error);
            this.community.innerHTML = '<p>Unable to load community posts</p>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded, initializing CommunityFeed');
    new CommunityFeed();
});

export default CommunityFeed;