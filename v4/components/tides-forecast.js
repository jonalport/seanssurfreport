<!-- tides-forecast.js -->

class TidesForecast extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.ky = "bab808b6-a9d1-4088-b927-0f36ce396e75";
    this.date = new Date().toISOString().split("T")[0];
    this.latitude = this.getAttribute("latitude");
    this.longitude = this.getAttribute("longitude");
    this.observer = null;
    this.spinner = null;
  }

  connectedCallback() {
    this.spinner = document.createElement("div");
    this.spinner.textContent = "Loading...";
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
    const useMockData = true; // Toggle: true for mock, false for live API
    if (useMockData) {
      const mockData = {
        extremes: [
          { date: "2025-03-08T06:00:00Z", type: "High", height: 2.1 }, // Today
          { date: "2025-03-08T12:00:00Z", type: "Low", height: 0.3 },
          { date: "2025-03-08T18:00:00Z", type: "High", height: 2.0 },
          { date: "2025-03-08T23:00:00Z", type: "Low", height: 0.4 },
          { date: "2025-03-09T06:30:00Z", type: "High", height: 2.2 }, // Tomorrow
          { date: "2025-03-09T12:30:00Z", type: "Low", height: 0.5 },
          { date: "2025-03-09T18:45:00Z", type: "High", height: 2.3 },
          { date: "2025-03-09T23:45:00Z", type: "Low", height: 0.6 },
          { date: "2025-03-10T07:00:00Z", type: "High", height: 2.4 }, // Day after tomorrow
          { date: "2025-03-10T13:00:00Z", type: "Low", height: 0.4 },
          { date: "2025-03-10T19:00:00Z", type: "High", height: 2.2 },
          { date: "2025-03-10T23:30:00Z", type: "Low", height: 0.5 },
          { date: "2025-03-11T07:15:00Z", type: "High", height: 2.3 }, // +1 day
          { date: "2025-03-11T13:15:00Z", type: "Low", height: 0.6 },
          { date: "2025-03-11T19:15:00Z", type: "High", height: 2.1 },
          { date: "2025-03-11T23:45:00Z", type: "Low", height: 0.4 },
          { date: "2025-03-12T07:30:00Z", type: "High", height: 2.2 }, // +2 days
          { date: "2025-03-12T13:30:00Z", type: "Low", height: 0.5 },
          { date: "2025-03-13T07:45:00Z", type: "High", height: 2.3 }, // +3 days
                  { date: "2025-03-13T13:45:00Z", type: "Low", height: 0.6 },
          { date: "2025-03-13T19:45:00Z", type: "High", height: 2.1 },
          { date: "2025-03-13T23:45:00Z", type: "Low", height: 0.4 },
          { date: "2025-03-14T08:00:00Z", type: "High", height: 2.2 }, // +4 days
          { date: "2025-03-14T14:00:00Z", type: "Low", height: 0.5 }
        ],
        heights: []
      };
      this.renderData(mockData.extremes, mockData.extremes);
      this.spinner.remove();
      return;
    }

    const apiUrl = `https://www.worldtides.info/api/v3?heights&extremes&date=${this.date}&lat=${this.latitude}&lon=${this.longitude}&days=7&key=${this.ky}&timemode=24`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.extremes && data.heights) {
        this.renderData(data.extremes, data.heights);
        this.spinner.remove();
      } else console.error("Unable to fetch forecast data");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  renderData(extremesData, tideHeightData) {
    // Limit chart to today (4 tides: 2 highs, 2 lows)
    const today = new Date(this.date).toLocaleDateString();
    const chartExtremes = extremesData.filter(entry => {
      const entryDate = new Date(entry.date).toLocaleDateString();
      return entryDate === today;
    }).slice(0, 4); // Ensure only 4 points for today

    // Table shows day after tomorrow + 4 extra days (16 tides)
    const dayAfterTomorrowDate = new Date(this.date);
    dayAfterTomorrowDate.setDate(dayAfterTomorrowDate.getDate() + 2);
    const dayAfterTomorrow = dayAfterTomorrowDate.toLocaleDateString();
    const tableStartIndex = extremesData.findIndex(entry => {
      const entryDate = new Date(entry.date).toLocaleDateString();
      return entryDate === dayAfterTomorrow;
    });
    const slicedExtremesData = extremesData.slice(tableStartIndex, tableStartIndex + 16);

    const container = document.createElement("div");
    const row = document.createElement("div");
    row.classList.add("row", "m-0", "p-0");

    const chartCol = document.createElement("div");
    chartCol.classList.add("col-md-9", "chart-container");

    const tableCol = document.createElement("div");
    tableCol.classList.add("col-md-3");
    const tableContainer = document.createElement("div");
    tableContainer.innerHTML = `
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet"
      integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
      <style>
        canvas { width: 100%; height: 100%; }
        .chart-container, table { max-height: 600px; overflow-y: auto; }
        @media (max-width: 780px) { .chart-container { margin-bottom: 2rem!important; } }
        td { font-size: 14px; } /* Match text size to chart labels */
      </style>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Tide</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
    `;

    const tbody = tableContainer.querySelector("tbody");
    slicedExtremesData.forEach((entry) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${this.formatDateTime(entry.date)}</td>
        <td>${entry.type}</td>
      `;
      tbody.appendChild(row);
    });

    tableCol.appendChild(tableContainer);
    row.appendChild(chartCol);
    row.appendChild(tableCol);
    container.appendChild(row);
    this.shadowRoot.appendChild(container);

    this.renderChart(chartCol, chartExtremes);
  }

  renderChart(container, extremesData) {
    // Prepare extreme points with timestamps
    const extremePoints = extremesData.map(entry => {
      const dateTime = new Date(entry.date);
      const timeLabel = dateTime.toLocaleString("en-US", { hour: "numeric", minute: "numeric", timeZone: "Asia/Dubai" });
      return {
        x: dateTime.getTime(), // Use timestamp for linear scale
        y: entry.height,
        time: timeLabel,
        type: entry.type,
        timestamp: dateTime.getTime()
      };
    });

    // Generate sine wave points between extremes
    const sinePoints = [];
    const stepsPerSegment = 50; // Smooth curve with 50 points per segment
    for (let i = 0; i < extremePoints.length - 1; i++) {
      const start = extremePoints[i];
      const end = extremePoints[i + 1];
      const timeDiff = end.timestamp - start.timestamp;

      for (let j = 0; j <= stepsPerSegment; j++) {
        const t = j / stepsPerSegment;
        const x = start.timestamp + t * timeDiff;
        const amplitude = (end.y - start.y) / 2;
        const mid = (start.y + end.y) / 2;
        const phase = t * 2 * Math.PI; // Full sine wave cycle
        const y = mid + amplitude * Math.sin(phase);

        sinePoints.push({ x, y });
      }
    }

    // Define minimal suggested labels for debugging (optional, not used directly)
    const suggestedLabels = extremePoints.map(p => p.time);

    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 300;
    container.appendChild(canvas);

    const ctx = canvas.getContext("2d");

    new Chart(ctx, {
      data: {
        datasets: [
          {
            type: "line",
            label: "Tide Curve",
            data: [...sinePoints, ...extremePoints], // Include extremes for continuity
            xAxisID: "x", // Explicitly assign x-axis
            borderColor: "black",
            borderWidth: 2,
            fill: true,
            backgroundColor: "rgba(173, 216, 230, 0.3)",
            tension: 0.4,
            pointRadius: 0,
            pointHitRadius: 0
          },
          {
            type: "scatter",
            label: "Tide Extremes",
            data: extremePoints.map(p => ({ x: p.x, y: p.y, time: p.time, type: p.type })),
            xAxisID: "x", // Explicitly assign x-axis
            backgroundColor: "black",
            pointRadius: 0,
            pointHitRadius: 0,
            datalabels: {
              anchor: "end",
              align: "top",
              formatter: (value) => `${value.time}\n${value.y.toFixed(1)}m`, // Height in meters
              color: "black",
              font: { size: 14 }
            }
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "linear",
            position: "bottom",
            display: false, // Hide x-axis
            grid: { display: false },
            ticks: {
              display: false,
              callback: () => null, // Prevent any tick rendering
              maxTicksLimit: 0 // Limit to zero ticks
            },
            min: extremePoints[0].x, // Set min to first point
            max: extremePoints[extremePoints.length - 1].x // Set max to last point
          },
          y: {
            display: false, // Hide y-axis
            grid: { display: false },
            ticks: {
              display: false,
              callback: () => null, // Prevent any tick rendering
              maxTicksLimit: 0 // Limit to zero ticks
            }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
          datalabels: {
            display: true,
            color: "black",
            font: { size: 14 }
          }
        },
        elements: {
          point: {
            radius: 0,
            hitRadius: 0
          },
          line: {
            borderCapStyle: "round"
          }
        },
        layout: {
          padding: { top: 0, right: 0, bottom: 0, left: 0 }
        },
        animation: {
          duration: 0
        }
      },
      plugins: [ChartDataLabels]
    });

    console.log("Suggested labels (for debug):", suggestedLabels); // Debug log
  }

  formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString("en-US", {
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      month: "short",
      timeZone: "Asia/Dubai"
    });
  }
}

customElements.define("tides-forecast", TidesForecast);