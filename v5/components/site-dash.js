window.loadDashContent = function(main) {
    main.innerHTML = '';
    main.removeAttribute('style');
  
    document.querySelectorAll('style:not(#dashboard-layout-style)').forEach(style => style.remove());
  
    main.innerHTML = `
      <section>
        <div class="dash-card-grid">
          ${getDashboardCards()}
        </div>
      </section>
    `;
  
    const applyDashCardStyles = () => {
      const dashCards = main.querySelectorAll('.dash-card');
      dashCards.forEach(card => {
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
          position: relative;
          margin: 0;
          padding: 0;
        `;
      });
  
      const dashCardWrappers = main.querySelectorAll('.dash-card-wrapper');
      dashCardWrappers.forEach(wrapper => {
        wrapper.style.cssText = `
          width: 100%;
          display: flex;
          flex-direction: column;
          margin: 0;
          padding: 0;
          height: auto;
        `;
      });
    };
    applyDashCardStyles();
  
    const existingStyle = document.getElementById('dashboard-layout-style');
    if (existingStyle) existingStyle.remove();
  
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
        margin: 0;
        padding: 0;
      }
      section { 
        width: 90%;
        margin: 2vh auto; 
        flex-grow: 1;
        padding: 0;
      }
      .dash-card-grid { 
        display: grid; 
        grid-template-columns: repeat(2, 1fr); 
        gap: 2vh;
        width: 100%; 
        margin: 0 auto;
        padding: 0;
        flex-grow: 1;
        min-height: 0;
      }
      .dash-card-wrapper { 
        width: 100%; 
        display: flex; 
        flex-direction: column; 
        margin: 0; 
        padding: 0; 
        height: auto;
      }
      .dash-card-link {
        text-decoration: none;
        color: inherit;
        display: block;
      }
      .dash-card-link:hover .dash-card {
        opacity: 0.9;
      }
      .dash-card { 
        width: 100%;
        aspect-ratio: 2 / 1;
        margin: 0;
        padding: 0;
        flex-grow: 0;
        flex-shrink: 0;
        cursor: pointer;
      }
      .dash-card-text { 
        font-size: 0.9rem; 
        padding: 8px; 
        background-color: #fff; 
        border-radius: 0 0 8px 8px; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.1); 
        text-align: center; 
        white-space: nowrap; 
        color: #000; 
        margin: 0;
        flex-grow: 0;
        flex-shrink: 0;
      }
      widget-windguru.dash-widget { 
        width: 14%;
        aspect-ratio: 1 / 1;
        position: absolute; 
        bottom: 5%;
        left: 2.5%;
        z-index: 10;
      }
      site-footer { 
        flex-shrink: 0; 
      }
      @media (max-width: 640px) { 
        .dash-card-grid { 
          grid-template-columns: 1fr; 
          width: 100%;
          gap: 2vh;
        }
        .dash-card-wrapper { 
          width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
  
    const nav = document.querySelector('site-nav');
    if (nav) {
      nav.style.display = 'none';
      nav.querySelectorAll('widget-windguru').forEach(widget => {
        widget.innerHTML = '';
      });
    }
  
    history.pushState({ page: 'dashboard' }, 'Dashboard', '#dashboard');
  
    let widgetInitializationTimeout = null;
  
    const initializeWidgets = (retryCount = 0, maxRetries = 3) => {
      if (widgetInitializationTimeout) {
        clearTimeout(widgetInitializationTimeout);
      }
  
      widgetInitializationTimeout = setTimeout(() => {
        console.log('Cleaning up existing Windguru scripts');
        document.querySelectorAll('script[id^="wglive_"]').forEach(script => {
          console.log(`Removing Windguru script: ${script.id}`);
          script.remove();
        });
  
        document.querySelectorAll('widget-windguru').forEach(widget => {
          widget.innerHTML = '';
        });
  
        const widgetElements = document.querySelectorAll('.dash-card widget-windguru.dash-widget');
        console.log(`Dashboard widget elements found: ${widgetElements.length}`);
  
        widgetElements.forEach((widget, idx) => {
          const parent = widget.closest('.dash-card-link')?.getAttribute('href') || 'unknown';
          console.log(`Widget ${idx}: Parent link = ${parent}`);
        });
  
        if (widgetElements.length !== 5 && retryCount < maxRetries) {
          console.warn(`Expected 5 dashboard widget elements, found ${widgetElements.length}, retrying in 1000ms (attempt ${retryCount + 1}/${maxRetries})`);
          initializeWidgets(retryCount + 1, maxRetries);
          return;
        }
  
        if (widgetElements.length !== 5) {
          console.error(`Incorrect number of dashboard widget elements (${widgetElements.length}), falling back to generic selector`);
          const fallbackElements = document.querySelectorAll('widget-windguru.dash-widget');
          console.log(`Fallback widget elements found: ${fallbackElements.length}`);
          if (fallbackElements.length === 5) {
            injectWindguruWidgets(fallbackElements);
          } else {
            console.error('Insufficient widget elements for dashboard, aborting widget initialization');
            return;
          }
        } else {
          injectWindguruWidgets(widgetElements);
        }
      }, 100);
    };
  
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      console.log('DOM ready, initializing widgets');
      initializeWidgets();
    } else {
      console.log('Waiting for DOMContentLoaded to initialize widgets');
      document.addEventListener('DOMContentLoaded', () => {
        console.log('DOMContentLoaded fired, initializing widgets');
        initializeWidgets();
      }, { once: true });
    }
  
    const attachClickListeners = () => {
      const dashCardLinks = main.querySelectorAll('.dash-card-link');
      dashCardLinks.forEach(link => {
        link.addEventListener('click', (event) => {
          event.preventDefault();
          const page = link.getAttribute('href').substring(1);
          const navComponent = document.querySelector('site-nav');
          if (navComponent && typeof navComponent.loadPage === 'function') {
            navComponent.loadPage(page);
          }
        });
      });
    };
    attachClickListeners();
  };
  
  function injectWindguruWidgets(widgetElements) {
    console.log('Injecting Windguru widget: wglive_2146_1706848056699 at index 0');
    window.injectWindguruWidget('2146', 'wglive_2146_1706848056699', 0, widgetElements);
    console.log('Injecting Windguru widget: wglive_3568_1706847920748 at index 1');
    window.injectWindguruWidget('3568', 'wglive_3568_1706847920748', 1, widgetElements);
    console.log('Injecting Windguru widget: wglive_3858_1710779222995 at index 2');
    window.injectWindguruWidget('3858', 'wglive_3858_1710779222995', 2, widgetElements);
    console.log('Injecting Windguru widget: wglive_4065_1715855101032 at index 3');
    window.injectWindguruWidget('4065', 'wglive_4065_1715855101032', 3, widgetElements);
    console.log('Injecting Windguru widget: wglive_2014_1713422960240 at index 4');
    window.injectWindguruWidget('2014', 'wglive_2014_1713422960240', 4, widgetElements);
  }
  
  function getDashboardCards() {
    const locations = [
      { image: window.getLocationImage('kbc'), text: 'Kitesurf Beach Center, UAQ', page: 'kbc' },
      { image: window.getLocationImage('bos'), text: 'Blue Ocean Sports, Jebel Ali', page: 'bos' },
      { image: window.getLocationImage('yas'), text: 'Yas Kite Area, Abu Dhabi', page: 'yas' },
      { image: window.getLocationImage('dosc'), text: 'Dubai Offshore Sailing Club', page: 'dosc' },
      { image: window.getLocationImage('sandy'), text: 'Sandy Beach Hotel, Dibba', page: 'sandy' },
      { image: window.getLocationImage('mikoko'), text: 'Mikoko, Umm Al Quwain', page: 'mikoko' }
    ];
    return locations.map(loc => `
      <a href="#${loc.page}" class="dash-card-link">
        <div class="dash-card-wrapper">
          <div class="dash-card" style="background-image: url('${loc.image}')">
            ${loc.page !== 'mikoko' ? '<widget-windguru class="dash-widget"></widget-windguru>' : ''}
          </div>
          <div class="dash-card-text">${loc.text}</div>
        </div>
      </a>
    `).join('');
  }