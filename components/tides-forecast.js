class TidesForecast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.ky = "bab808b6-a9d1-4088-b927-0f36ce396e75";
    this.date = new Date().toISOString().split("T")[0]; // Current date in "YYYY-MM-DD" format
    this.latitude = this.getAttribute("latitude");
    this.longitude = this.getAttribute("longitude");
    this.observer = null;
    this.spinner = null;
  }

  connectedCallback() {
    // show a loading spinner
    this.spinner = document.createElement("loading-spinner");
    this.shadowRoot.appendChild(this.spinner);

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.fetchTidesData();
          observer.unobserve(entry.target);
        }
      });
    });

    this.observer.observe(this);
  }

  disconnectedCallback() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  async fetchTidesData() {
    const apiUrl = `https://www.worldtides.info/api/v3?heights&extremes&date=${this.date}&lat=${this.latitude}&lon=${this.longitude}&days=5&key=${this.ky}&timemode=24`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.extremes && data.heights) {
        this.renderData(data.extremes, data.heights);
        this.spinner.remove(); // Remove the spinner after the data has been rendered
      } else console.error("Unable to fetch forecast data");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  renderData(extremesData, tideHeightData) {
    // Data for table - next 10 tides
    const slicedExtremesData = extremesData.slice(0, 10);

    // Create a Bootstrap row
    const container = document.createElement("div");
    const row = document.createElement("div");
    row.classList.add("row", "m-0", "p-0");

    // Create a Bootstrap column for the table
    const tableCol = document.createElement("div");
    tableCol.classList.add("col-md-3"); // Medium width: 4 columns
    const tableContainer = document.createElement("div");
    tableContainer.innerHTML = `
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
          <style>
            canvas {
              width: 100%;
              height: 100%;
            }

            .chart-container {
              max-height: 600px;
            }

            @media (max-width: 780px){
              .chart-container {
                margin-bottom: 2rem!important;
              }
            }
 
          </style>
          <table class="table">
            <thead>
              <tr>
              <th scope="col">Time</th>
                <th scope="col">Tide</th>
              </tr>
            </thead>
            <tbody>
            </tbody>
          </table>
    `;

    const tbody = tableContainer.querySelector("tbody");

    // Populate the table
    slicedExtremesData.forEach((entry, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${this.formatDateTime(entry.date)}</td>
        <td>${entry.type}</td>
      `;
      tbody.appendChild(row);
    });

    tableCol.appendChild(tableContainer);

    // Create a Bootstrap column for the chart
    const chartCol = document.createElement("div");
    chartCol.classList.add("col-md-9", "chart-container");
    row.appendChild(chartCol);
    row.appendChild(tableCol);
    container.appendChild(row);
    this.shadowRoot.appendChild(container);

    // render the tides chart
    this.renderChart(chartCol, tideHeightData);
  }

  renderChart(container, data) {
    const dataPoints = data
      .map((entry) => {
        const dateTime = new Date(entry.date);
        const formattedDateTime = dateTime.toLocaleString("en-US", {
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          // month: "short",
          timeZone: "Asia/Dubai",
        });

        const label = `${formattedDateTime}`;

        return {
          label: label,
          height: entry.height,
        };
      })
      .slice(0, 50);

    const labels = dataPoints.map((entry) => entry.label);
    const heights = data.map((entry) => entry.height);

    // Create a canvas element for the Chart
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Tidal Heights",
            data: heights,
            borderWidth: 0,
            fill: "start",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "category",
            labels: labels,
            position: "bottom",
            grid: {
              display: true,
            },
          },
          y: {
            grid: {
              display: true,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          customCanvasBackgroundColor: {
            color: "lightGreen",
          },
        },
      },
    });
  }

  formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const formattedDateTime = dateTime.toLocaleString("en-US", {
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      month: "short",
      timeZone: "Asia/Dubai",
    });
    return formattedDateTime;
  }
}

customElements.define("tides-forecast", TidesForecast);
