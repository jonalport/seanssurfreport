// tides-forecast.js
class TidesForecast extends HTMLElement {
  constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.apiKey = 'bab808b6-a9d1-4088-b927-0f36ce396e75'; // Your working API key
      this.latitude = this.getAttribute('latitude');
      this.longitude = this.getAttribute('longitude');

      this.shadowRoot.innerHTML = `
          <style>
              :host {
                  display: block;
                  width: 90%; /* Matches #wind-graph width */
                  margin: 0 auto; /* Centers like #wind-graph */
                  padding: 10px; /* Matches content-block padding */
                  box-sizing: border-box;
              }
              canvas {
                  width: 100% !important; /* Ensures canvas fills container */
                  height: 250px !important; /* Matches Windguru gsize=250 */
                  border: 0 solid #000; /* Matches iframe border override */
              }
          </style>
          <canvas id="tideChart"></canvas>
      `;
  }

  async connectedCallback() {
      if (!window.Chart) {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
          script.onload = () => this.fetchTideData();
          script.onerror = () => {
              console.error('Failed to load Chart.js');
              this.shadowRoot.innerHTML = '<p>Error loading tide chart library</p>';
          };
          document.head.appendChild(script);
      } else {
          this.fetchTideData();
      }
  }

  async fetchTideData() {
      const heightsUrl = `https://www.worldtides.info/api/v3?heights&lat=${this.latitude}&lon=${this.longitude}&key=${this.apiKey}&days=5&step=3600`;
      const extremesUrl = `https://www.worldtides.info/api/v3?extremes&lat=${this.latitude}&lon=${this.longitude}&key=${this.apiKey}&days=5`;

      try {
          const [heightsResponse, extremesResponse] = await Promise.all([
              fetch(heightsUrl),
              fetch(extremesUrl)
          ]);

          if (!heightsResponse.ok || !extremesResponse.ok) {
              const errorData = await (heightsResponse.ok ? extremesResponse : heightsResponse).json();
              console.log('Error details:', errorData);
              throw new Error(`HTTP error! Status: ${heightsResponse.status || extremesResponse.status}`);
          }

          const heightsData = await heightsResponse.json();
          const extremesData = await extremesResponse.json();

          if (heightsData.status !== 200 || extremesData.status !== 200) {
              throw new Error(heightsData.error || extremesData.error || 'Unknown error from WorldTides API');
          }

          this.renderChart(heightsData, extremesData);
      } catch (error) {
          console.error('Error fetching tide data:', error);
          this.shadowRoot.innerHTML = '<p>Unable to load tide data</p>';
      }
  }

  renderChart(heightsData, extremesData) {
      const ctx = this.shadowRoot.querySelector('#tideChart').getContext('2d');
      const heights = heightsData.heights.map(h => h.height);
      const labels = heightsData.heights.map(h => {
          const date = new Date(h.date);
          return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      });

      // Identify day boundaries and labels
      const days = [];
      const dayLabels = [];
      const dayCenters = [];
      let currentDay = '';
      heightsData.heights.forEach((h, i) => {
          const date = new Date(h.date);
          const day = date.toLocaleDateString();
          if (day !== currentDay) {
              currentDay = day;
              days.push(i);
              dayLabels.push(date.toLocaleDateString('en-US', { weekday: 'long' }));
              const nextDayIndex = days[days.length] || heights.length;
              dayCenters.push(Math.floor((i + (nextDayIndex - 1)) / 2));
          }
      });

      // Map extremes to hourly indices and prepare point data
      const pointData = new Array(heights.length).fill(null);
      const pointLabels = new Array(heights.length).fill(null);
      const pointTypes = new Array(heights.length).fill(null);
      extremesData.extremes.forEach(extreme => {
          const extremeTime = new Date(extreme.dt * 1000);
          const closestIndex = heightsData.heights.findIndex(h => {
              const heightTime = new Date(h.date);
              return Math.abs(heightTime - extremeTime) < 1800000; // Within 30 minutes
          });
          if (closestIndex !== -1) {
              pointData[closestIndex] = extreme.height;
              const time = extremeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              pointLabels[closestIndex] = `${time} (${extreme.height.toFixed(2)}m)`;
              pointTypes[closestIndex] = extreme.type; // "High" or "Low"
          }
      });

      // Background zones for alternating days
      const backgroundPlugin = {
          id: 'customBackground',
          beforeDraw: (chart) => {
              const { ctx, chartArea, scales } = chart;
              const { left, right, top, bottom } = chartArea;
              const xScale = scales.x;

              ctx.save();
              days.forEach((dayIndex, i) => {
                  const nextDayIndex = days[i + 1] || labels.length;
                  const xStart = xScale.getPixelForValue(dayIndex);
                  const xEnd = xScale.getPixelForValue(nextDayIndex - 1);

                  ctx.fillStyle = i % 2 === 0 ? '#ffffff' : '#f0f0f0';
                  ctx.fillRect(xStart, top, xEnd - xStart, bottom - top);
              });
              ctx.restore();
          }
      };

      // Annotation plugin for tide labels
      const annotationPlugin = {
          id: 'customAnnotations',
          afterDraw: (chart) => {
              const { ctx, chartArea, scales } = chart;
              const xScale = scales.x;
              const yScale = scales.y;

              ctx.save();
              ctx.font = '12px Arial';
              ctx.fillStyle = '#000000';
              ctx.textAlign = 'center';

              pointLabels.forEach((label, index) => {
                  if (label) {
                      const x = xScale.getPixelForValue(index);
                      const yOffset = pointTypes[index] === 'High' ? -10 : 15;
                      const y = yScale.getPixelForValue(pointData[index]) + yOffset;
                      ctx.textBaseline = pointTypes[index] === 'High' ? 'bottom' : 'top';
                      ctx.fillText(label, x, y);
                  }
              });
              ctx.restore();
          }
      };

      Chart.register(backgroundPlugin, annotationPlugin);

      new Chart(ctx, {
          type: 'line',
          data: {
              labels: labels,
              datasets: [
                  {
                      label: 'Tide Height (m)',
                      data: heights,
                      borderColor: '#007bff',
                      backgroundColor: 'rgba(0, 123, 255, 0.1)',
                      fill: true,
                      tension: 0.4,
                      pointRadius: 0,
                      order: 2 // Line drawn first
                  },
                  {
                      label: 'High/Low Tides',
                      data: pointData,
                      borderColor: '#ff0000',
                      backgroundColor: '#ff0000',
                      pointRadius: 4,
                      pointHoverRadius: 6,
                      pointStyle: 'circle',
                      fill: false,
                      tension: 0,
                      order: 1 // Points next
                  }
              ]
          },
          options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                  x: {
                      title: {
                          display: false // Hide "Time" title
                      },
                      ticks: {
                          callback: function(value, index, values) {
                              // Place label at the center of each day
                              const centerIndex = dayCenters.find(center => Math.abs(center - index) < 12); // Within half a day
                              if (centerIndex === index) {
                                  return dayLabels[dayCenters.indexOf(centerIndex)];
                              }
                              return '';
                          },
                          align: 'center',
                          autoSkip: false, // Show all labels
                          maxTicksLimit: 5, // One per day
                          font: {
                              size: 12
                          },
                          stepSize: 24 // One tick per day (24 hours)
                      },
                      grid: {
                          drawOnChartArea: false
                      }
                  },
                  y: {
                      title: {
                          display: true,
                          text: 'Height (m)'
                      },
                      beginAtZero: true,
                      ticks: {
                          display: false
                      }
                  }
              },
              plugins: {
                  legend: {
                      display: true,
                      position: 'top'
                  },
                  tooltip: {
                      mode: 'index',
                      intersect: false
                  }
              }
          },
          plugins: [backgroundPlugin, annotationPlugin]
      });
  }
}

customElements.define('tides-forecast', TidesForecast);