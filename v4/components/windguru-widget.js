// Windguru Widget Loader
const wgConfig = {
    color: 'light',
    wj: 'knots',
    tj: 'c',
    avg_min: '0',
    gsize: '400',
    msize: '400',
    m: '3',
    arrow: 'y',
    show: 'n,g,c,f,m'
};

function loadWindguruWidget(script) {
    const spotId = script.getAttribute('data-wg-spot');
    const uid = script.id;
    const errorDiv = script.nextElementSibling;
    const params = [`spot=${spotId}`, `uid=${uid}`, ...Object.entries(wgConfig).map(([k, v]) => `${k}=${v}`)];
    const wgScript = document.createElement('script');

    wgScript.src = `https://www.windguru.cz/js/wglive.php?${params.join('&')}`;
    wgScript.async = true;

    wgScript.onerror = () => {
        console.error(`Failed to load Windguru widget for spot ${spotId}`);
        if (errorDiv?.classList.contains('wg-error')) {
            errorDiv.style.display = 'block';
        }
    };

    wgScript.onload = () => {
        if (errorDiv?.classList.contains('wg-error')) {
            errorDiv.style.display = 'none';
        }
    };

    script.parentNode.insertBefore(wgScript, script.nextSibling);
}

function initializeWindguruWidgets() {
    const scripts = document.querySelectorAll('script[id^="wglive_"]');
    scripts.forEach(script => {
        try {
            loadWindguruWidget(script);
        } catch (error) {
            console.error('Error initializing Windguru widget:', error);
            const errorDiv = script.nextElementSibling;
            if (errorDiv?.classList.contains('wg-error')) {
                errorDiv.style.display = 'block';
            }
        }
    });
}

