const apiKey = 'YOUR_API_KEY';

const stationId = '9410170';
const dateFormat = 'YYYY-MM-DD HH:mm';

const latitude = '32.726274';
const longitude = '-117.251445';

async function fetchTideData() {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 1 * 60 * 60 * 1000);
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const beginDate = formatDate(oneHourAgo);
  const endDate = formatDate(oneDayLater);

  const response = await fetch(
    `https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?begin_date=${beginDate}&end_date=${endDate}&station=${stationId}&product=predictions&datum=MLLW&units=english&time_zone=lst_ldt&interval=6&format=json`
  );
  const data = await response.json();
  return data;
}

function formatDate(date) {
  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const HH = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${yyyy}${MM}${dd} ${HH}:${mm}`;
}

function processTideData(tideData) {
  const tidePoints = tideData.predictions.map((tide) => {
    return {
      x: new Date(`${tide.t.split(' ')[0]}T${tide.t.split(' ')[1]}:00`),
      y: parseFloat(tide.v),
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
          data: tidePoints,
          borderColor: 'blue',
          fill: false,
        },
        {
          data: [
            { x: tidePoints[0].x, y: 2 },
            { x: tidePoints[tidePoints.length - 1].x, y: 2 },
          ],
          borderColor: 'red',
          fill: false,
          borderDash: [5, 5],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'hour',
            parser: 'yyyy-MM-dd HH:mm',
            tooltipFormat: 'MMM d, yyyy h:mm a',
          },
          adapters: {
            date: {
              dateLibrary: 'date-fns',
            },
          },
        },
        y: {},
      },
    },
  });
}

(async () => {
  const tideData = await fetchTideData();
  console.log('tideData', tideData);
  const tidePoints = processTideData(tideData);
  plotTides(tidePoints);
})();
