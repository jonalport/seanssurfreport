// Discourse Notification Bubble
const forumUrl = 'https://community.seanssurfreport.com';
const apiEndpoint = `${forumUrl}/latest.json`;

async function checkForNewPosts(logoHeader) {
    try {
        const response = await fetch(apiEndpoint, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();

        const lastVisit = localStorage.getItem('lastVisit') || Date.now();
        const lastVisitTime = new Date(parseInt(lastVisit));
        const newPosts = data.topics.filter(topic => new Date(topic.created_at) > lastVisitTime);

        const bubble = logoHeader.shadowRoot.querySelector('.notification-bubble');
        if (bubble) {
            bubble.classList.toggle('active', newPosts.length > 0);
        }

        const communityLink = logoHeader.shadowRoot.querySelector('.main-nav-link');
        if (communityLink) {
            communityLink.addEventListener('click', () => {
                localStorage.setItem('lastVisit', Date.now());
                if (bubble) bubble.classList.remove('active');
            });
        }
    } catch (error) {
        console.error('Error fetching Discourse posts:', error);
    }
}

function initializeDiscourseNotifications() {
    const logoHeader = document.querySelector('logo-header');
    if (logoHeader?.shadowRoot) {
        checkForNewPosts(logoHeader);
        setInterval(() => checkForNewPosts(logoHeader), 300000); // 5 minutes
    }
}

// Initialize Everything on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    initializeWindguruWidgets();
    initializeDiscourseNotifications();
});