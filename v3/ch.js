async function fetchCommunityHighlights() {
    try {
        // Fetch the JSON data from the Discourse API
        const response = await fetch('https://community.seanssurfreport.com/latest.json', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();

        // Check if topic_list and topics exist
        if (!data.topic_list || !data.topic_list.topics) {
            throw new Error('No topics found in response');
        }

        // Get the latest 3 topics
        const latestTopics = data.topic_list.topics.slice(0, 3);

        // Target the container where highlights will be displayed
        const highlightsContainer = document.getElementById('community-highlights');
        if (!highlightsContainer) {
            throw new Error('Highlights container not found in HTML');
        }

        // Summarize and inject the posts
        highlightsContainer.innerHTML = latestTopics.map(topic => {
            const titleWords = topic.title.split(' ').slice(0, 6).join(' ');
            const truncatedTitle = topic.title.split(' ').length > 6 ? `${titleWords}...` : titleWords;
            const createdDate = new Date(topic.created_at).toLocaleDateString(); // e.g., "3/7/2025"

            return `
                <div class="post-highlight">
                    <a href="https://community.seanssurfreport.com/t/${topic.slug}/${topic.id}" 
                       target="_blank">${truncatedTitle}</a>
                    <span class="post-date">${createdDate}</span>
                </div>
            `;
        }).join('');

        // Add basic styling
        const style = document.createElement('style');
        style.textContent = `
            .post-highlight {
                margin-bottom: 10px;
                font-size: 0.9rem;
            }
            .post-highlight a {
                text-decoration: none;
                color: #007bff; /* Blue link color */
            }
            .post-highlight a:hover {
                text-decoration: underline;
            }
            .post-highlight .post-date {
                display: block;
                color: #666; /* Gray for date */
                font-size: 0.8rem;
            }
        `;
        highlightsContainer.appendChild(style);
    } catch (error) {
        console.error('Error fetching community highlights:', error);
        const highlightsContainer = document.getElementById('community-highlights');
        if (highlightsContainer) {
            highlightsContainer.innerHTML = '<p>Unable to load community highlights</p>';
        }
    }
}

// Run when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing community highlights');
    fetchCommunityHighlights();
});