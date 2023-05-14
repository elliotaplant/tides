const apiKey = 'YOUR_API_KEY';
const latitude = 'LATITUDE';
const longitude = 'LONGITUDE';

async function fetchTideData() {
  const response = await fetch(`https://www.worldtides.info/api/v3/tides?lat=${latitude}&lon=${longitude}&key=${apiKey}`);
  const data = await response.json();
  return data;
}
function processTideData(tideData) {
  const tidePoints = tideData.tides.map(tide => {
    return {
      x: new Date(tide.dt * 1000),
      y: tide.height
    };
  });
  return tidePoints;
}
function plotTides(tidePoints) {
  const ctx = document.getElementById('tideChart').getContext('2d');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'Tides',
          data: tidePoints,
          borderColor: 'blue',
          fill: false
        },
        {
          label: '-2ft',
          data: [{ x: tidePoints[0].x, y: -2 }, { x: tidePoints[tidePoints.length - 1].x, y: -2 }],
          borderColor: 'red',
          fill: false,
          borderDash: [5, 5]
        }
      ]
    },
    options: {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'hour'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Tide Height (ft)'
          }
        }
      }
    }
  });
}
(async () => {
  const tideData = await fetchTideData();
  const tidePoints = processTideData(tideData);
  plotTides(tidePoints);
})();
