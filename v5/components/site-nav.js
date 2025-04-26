class SiteNav extends HTMLElement {
  constructor() {
    super();
    const locations = [
      {
        page: "kbc",
        text: "Kitesurf Beach Center, UAQ",
        image: window.getLocationImage("kbc"),
      },
      {
        page: "bos",
        text: "Blue Ocean Sports, JA",
        image: window.getLocationImage("bos"),
      },
      {
        page: "yas",
        text: "Yas Kite Area, Abu Dhabi",
        image: window.getLocationImage("yas"),
      },
      {
        page: "dosc",
        text: "Dubai Offshore Sailing Club",
        image: window.getLocationImage("dosc"),
      },
      {
        page: "sandy",
        text: "Sandy Beach Hotel, Dibba",
        image: window.getLocationImage("sandy"),
      },
      {
        page: "mikoko",
        text: "Mikoko, UAQ",
        image: window.getLocationImage("mikoko"),
      },
    ];
    this.innerHTML = `
      <div class="nav-container">
        ${locations
          .map(
            (loc) => `
          <div class="nav-card-wrapper" data-page="${loc.page}">
            <div class="nav-card" style="background-image: url('${loc.image}')">
              <widget-windguru class="nav-widget"></widget-windguru>
            </div>
            <div class="nav-card-text">${loc.text}</div>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    this.addEventListener("click", this.handleCardClick.bind(this));
    this.injectWindguruWidgets();
  }

  connectedCallback() {
    const navContainer = this.querySelector(".nav-container");
    navContainer.style.cssText = `
      display: flex;
      overflow-x: auto;
      padding: 10px 10px;
      gap: 20px;
      white-space: nowrap;
      height: 100%;
      align-items: stretch;
      box-sizing: border-box;
      justify-content: center;
    `;

    const updateAlignment = () => {
      const contentWidth =
        Array.from(navContainer.querySelectorAll(".nav-card-wrapper")).reduce(
          (total, wrapper) => total + wrapper.offsetWidth + 20,
          0
        ) - 20;
      const containerWidth = navContainer.offsetWidth;
      navContainer.style.justifyContent =
        contentWidth > containerWidth ? "flex-start" : "center";
    };

    const images = this.querySelectorAll(".nav-card");
    let loadedImages = 0;
    const totalImages = images.length;

    const checkAlignment = () => {
      requestAnimationFrame(() => {
        navContainer.scrollLeft = 0;
        updateAlignment();
      });
    };

    if (totalImages === 0) {
      checkAlignment();
    } else {
      images.forEach((card) => {
        const tempImg = new Image();
        const bgImage = card.style.backgroundImage.slice(5, -2);
        tempImg.src = bgImage;
        tempImg.onload = tempImg.onerror = () => {
          loadedImages++;
          if (loadedImages === totalImages) {
            checkAlignment();
          }
        };
      });
    }

    window.addEventListener("resize", updateAlignment);

    this.querySelectorAll(".nav-card-wrapper").forEach((wrapper) => {
      wrapper.style.cssText = `
        flex: 0 0 auto;
        width: 200px;
        height: 100%;
        display: flex;
        flex-direction: column;
        cursor: pointer;
      `;
    });

    this.querySelectorAll(".nav-card").forEach((card) => {
      const bgImage = card.style.backgroundImage || "";
      card.style.cssText = `
        ${bgImage ? `background-image: ${bgImage};` : ""}
        flex: 1;
        background-color: #fff;
        border-radius: 8px 8px 0 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
        display: block;
      `;
    });

    this.querySelectorAll(".nav-card-text").forEach((text) => {
      text.style.cssText = `
        font-size: 0.8rem;
        padding: 8px;
        background-color: #fff;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        text-align: center;
        white-space: nowrap;
        color: #000;
      `;
    });

    this.querySelectorAll("widget-windguru.nav-widget").forEach((widget) => {
      widget.style.cssText = `
        width: 20%;
        aspect-ratio: 1 / 1;
        position: absolute;
        bottom: 5%;
        left: 2.5%;
        z-index: 10;
      `;
    });
  }

  injectWindguruWidgets() {
    const widgetElements = this.querySelectorAll("widget-windguru.nav-widget");
    window.injectWindguruWidget(
      "2146",
      "wglive_2146_nav_1706848056699",
      0,
      widgetElements
    );
    window.injectWindguruWidget(
      "3568",
      "wglive_3568_nav_1706847920748",
      1,
      widgetElements
    );
    window.injectWindguruWidget(
      "3858",
      "wglive_3858_nav_1710779222995",
      2,
      widgetElements
    );
    window.injectWindguruWidget(
      "4065",
      "wglive_4065_nav_1715855101032",
      3,
      widgetElements
    );
    window.injectWindguruWidget(
      "2014",
      "wglive_2014_nav_1713422960240",
      4,
      widgetElements
    );
  }

  handleCardClick(event) {
    const wrapper = event.target.closest(".nav-card-wrapper");
    if (!wrapper) return;

    const page = wrapper.dataset.page;
    this.loadPage(page);
  }

  loadPage(page) {
    history.pushState({ page }, `Page ${page}`, `#${page}`);
    const main = document.querySelector("site-main");
    const nav = document.querySelector("site-nav");
    if (!main || !nav) return;

    const currentPage = window.location.hash.slice(1);
    const forecastPages = ["kbc", "bos", "yas", "dosc", "sandy", "mikoko"];
    if (forecastPages.includes(currentPage) && !forecastPages.includes(page)) {
      if (typeof window.unloadSiteContent === "function") {
        window.unloadSiteContent();
      }
      this.querySelectorAll("widget-windguru.nav-widget").forEach((widget) => {
        widget.innerHTML = "";
      });
    }

    if (currentPage === "community" && page !== "community") {
      if (typeof window.unloadCommunityContent === "function") {
        window.unloadCommunityContent();
      }
    }

    if (page === "dashboard") {
      const existingScript = document.getElementById("site-dash-script");
      if (existingScript) existingScript.remove();

      const script = document.createElement("script");
      script.src = "components/site-dash.js";
      script.id = "site-dash-script";
      script.onload = () => {
        if (typeof window.loadDashContent === "function") {
          window.loadDashContent(main);
          window.setSectionVisibility("dashboard");
        } else {
          main.innerHTML = `<p>Error loading dashboard</p>`;
        }
      };
      script.onerror = () => {
        main.innerHTML = `<p>Error loading dashboard</p>`;
      };
      document.body.appendChild(script);
      this.querySelectorAll("widget-windguru.nav-widget").forEach((widget) => {
        widget.innerHTML = "";
      });
    } else if (page === "community") {
      const existingScript = document.getElementById("site-community-script");
      if (existingScript) existingScript.remove();

      const script = document.createElement("script");
      script.src = "components/site-community.js";
      script.id = "site-community-script";
      script.onload = () => {
        if (typeof window.loadCommunityContent === "function") {
          window.loadCommunityContent(main);
          window.setSectionVisibility("community");
        } else {
          main.innerHTML = `<p>Error loading community page</p>`;
        }
      };
      script.onerror = () => {
        main.innerHTML = `<p>Error loading community page</p>`;
      };
      document.body.appendChild(script);
      this.querySelectorAll("widget-windguru.nav-widget").forEach((widget) => {
        widget.innerHTML = "";
      });
    } else {
      const pageType = forecastPages.includes(page) ? "forecast" : "unknown";
      window.setSectionVisibility(pageType);
      nav.style.display = pageType === "forecast" ? "" : "none";
      this.resetNavLayout();
      if (pageType === "forecast") {
        this.injectWindguruWidgets();
      }

      const locationMap = {
        kbc: "kbc",
        bos: "bos",
        yas: "yas",
        dosc: "dosc",
        sandy: "sandy",
        mikoko: "mikoko",
      };
      const locationId = locationMap[page] || page;

      const existingScript = document.getElementById("site-forecast-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.src = "components/site-forecast.js";
        script.id = "site-forecast-script";
        script.onload = () => {
          if (typeof window.loadSiteContent === "function") {
            window.loadSiteContent(main, locationId);
          } else {
            main.innerHTML = `<p>Error loading content for ${page}</p>`;
          }
        };
        script.onerror = () => {
          main.innerHTML = `<p>Error loading content for ${page}</p>`;
        };
        document.body.appendChild(script);
      } else if (typeof window.loadSiteContent === "function") {
        window.loadSiteContent(main, locationId);
      } else {
        main.innerHTML = `<p>Loading content for ${page}, please wait...</p>`;
      }
    }
  }

  resetNavLayout() {
    const navContainer = this.querySelector(".nav-container");
    navContainer.style.display = "none";
    void navContainer.offsetHeight;
    navContainer.style.cssText = `
      display: flex;
      overflow-x: auto;
      padding: 10px 10px;
      gap: 20px;
      white-space: nowrap;
      height: 100%;
      align-items: stretch;
      box-sizing: border-box;
      justify-content: center;
    `;

    this.querySelectorAll(".nav-card-wrapper").forEach((wrapper) => {
      wrapper.style.cssText = `
        flex: 0 0 auto;
        width: 200px;
        height: 100%;
        display: flex;
        flex-direction: column;
        cursor: pointer;
      `;
    });

    this.querySelectorAll(".nav-card").forEach((card) => {
      const bgImage = card.style.backgroundImage || "";
      card.style.cssText = `
        ${bgImage ? `background-image: ${bgImage};` : ""}
        flex: 1;
        background-color: #fff;
        border-radius: 8px 8px 0 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        position: relative;
        display: block;
      `;
    });

    this.querySelectorAll(".nav-card-text").forEach((text) => {
      text.style.cssText = `
        font-size: 0.8rem;
        padding: 8px;
        background-color: #fff;
        border-radius: 0 0 8px 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        text-align: center;
        white-space: nowrap;
        color: #000;
      `;
    });

    this.querySelectorAll("widget-windguru.nav-widget").forEach((widget) => {
      widget.style.cssText = `
        width: 20%;
        aspect-ratio: 1 / 1;
        position: absolute;
        bottom: 5%;
        left: 2.5%;
        z-index: 10;
      `;
    });
  }
}

customElements.define("site-nav", SiteNav);

window.addEventListener("popstate", (event) => {
  const nav = document.querySelector("site-nav");
  if (event.state && event.state.page && nav) {
    nav.loadPage(event.state.page);
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const nav = document.querySelector("site-nav");
  const hash = window.location.hash.slice(1) || "dashboard";
  if (nav) {
    nav.loadPage(hash);
  }
});
