window.loadDashContent = function(main) {
    main.innerHTML = `
        <section>
            <div class="cards-grid">
                ${getDashboardCards()}
            </div>
        </section>
    `;

    // Apply styles programmatically to mirror site-nav.js
    const cards = main.querySelectorAll('.card');
    cards.forEach(card => {
        const bgImage = card.style.backgroundImage || '';
        card.style.cssText = `
            ${bgImage ? `background-image: ${bgImage};` : ''}
            width: 100%;
            aspect-ratio: 2 / 1;
            background-color: #fff;
            border-radius: 8px 8px 0 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
        `;
    });

    // Remove existing dashboard styles if present
    const existingStyle = document.getElementById('dashboard-layout-style');
    if (existingStyle) existingStyle.remove();

    // Add container styles and full-height layout
    const style = document.createElement('style');
    style.id = 'dashboard-layout-style';
    style.textContent = `
        body { 
            display: flex; 
            flex-direction: column; 
            min-height: 100vh; 
            margin: 0; 
        }
        site-main { 
            flex-grow: 1; 
            display: flex; 
            flex-direction: column; 
        }
        section { 
            width: 90%; 
            margin: 0 auto; 
            padding: 20px 0; 
            flex-grow: 1; 
        }
        .cards-grid { 
            display: grid; 
            grid-template-columns: repeat(2, 1fr); 
            grid-gap: 20px; 
            width: 90%; 
            margin: 0 auto; 
        }
        .card-wrapper { 
            width: 100%; 
            display: flex; 
            flex-direction: column; 
        }
        .card-text { 
            font-size: 0.8rem; 
            padding: 8px; 
            background-color: #fff; 
            border-radius: 0 0 8px 8px; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
            text-align: center; 
            white-space: nowrap; 
            color: #000; 
        }
        site-footer { 
            flex-shrink: 0; 
        }
        @media (max-width: 600px) { 
            .cards-grid { 
                grid-template-columns: 1fr; 
                width: 90%; 
            }
            .card-wrapper { 
                width: 100%; 
            }
        }
    `;
    document.head.appendChild(style); // Append to head for global scope

    // Hide site-nav when loading dashboard
    const nav = document.querySelector('site-nav');
    if (nav) {
        nav.style.display = 'none';
    }

    // Update URL hash
    history.pushState({ page: 'dashboard' }, 'Dashboard', '#dashboard');
};

function getDashboardCards() {
    const locations = [
        { image: 'https://worker.seanssurfreport.com/kbc', text: 'Kitesurf Beach Center, UAQ', link: '/kbc' },
        { image: 'https://worker.seanssurfreport.com/bos', text: 'Blue Ocean Sports, Jebel Ali', link: '/blue-ocean-sports' },
        { image: 'https://worker.seanssurfreport.com/yas', text: 'Yas Kite Area, Abu Dhabi', link: '/yas' },
        { image: 'https://worker.seanssurfreport.com/dosc', text: 'Dubai Offshore Sailing Club', link: '/dosc' },
        { image: 'https://worker.seanssurfreport.com/sandy', text: 'Sandy Beach Hotel, Dibba', link: '/sandy' },
        { image: 'https://worker.seanssurfreport.com/mikoko', text: 'Mikoko, Umm Al Quwain', link: '/mikoko' }
    ];
    return locations.map(loc => `
        <a href="${loc.link}" class="card-wrapper">
            <div class="card" style="background-image: url('${loc.image}')"></div>
            <div class="card-text">${loc.text}</div>
        </a>
    `).join('');
}