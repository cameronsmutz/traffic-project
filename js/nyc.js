mapboxgl.accessToken = 'pk.eyJ1IjoiZWR3YXJkcDciLCJhIjoiY2xzZjZhZnYwMGdrbDJpcXB6MzZsN2lzbSJ9.o11htKQkTmOqa1HNdhtenQ';
// FOR NAVIGATION
// Get the element with the class "icon"
let icon = document.getElementsByClassName("icon")[0];

// Add an event listener for the 'click' event on the icon element
icon.addEventListener('click', responsive_control);

// Function to control the responsiveness of the navigation bar
function responsive_control() {
    // Get the element with the id "myTopnav"
    let x = document.getElementById("myTopnav");

    // Check if the class name of the element is "topnav"
    if (x.className === "topnav") {
    // If it is, add the "responsive" class to the element
    x.className += " responsive";
  } else {
    // If it's not, remove the "responsive" class from the element
    x.className = "topnav";
  }
}
// END OF NAVIGATION
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/edwardp7/cm868lju6007p01ssecfoavmb',
    center: [-74.006, 40.7128],
    zoom: 10
});

const trafficGeojsonFiles = {
    2020: 'assets/NYC_Traffic_minimized.geojson',
    2021: 'assets/NYC_Traffic_minimized.geojson',
    2022: 'assets/NYC_Traffic_minimized.geojson',
    2023: 'assets/NYC_Traffic_minimized.geojson'
};

const collisionGeojsonFiles = {
    2020: 'assets/nyc_crashes_2020_minimized.geojson',
    2021: 'assets/nyc_crashes_2021_minimized.geojson',
    2022: 'assets/nyc_crashes_2022_minimized.geojson',
    2023: 'assets/nyc_crashes_2023_minimized.geojson',
    // 2024: 'assets/nyc_crashes_2024_optimized.geojson',
    // 2025: 'assets/nyc_crashes_2025_optimized.geojson'
};

const loadGeoJSON = async (file) => {
    const response = await fetch(file + "?t=" + new Date().getTime());
    return await response.json();
};

const updateTrafficLayer = async (year) => {
    const trafficData = await loadGeoJSON(trafficGeojsonFiles[year]);

    if (map.getLayer('traffic-symbols')) map.removeLayer('traffic-symbols');
    if (map.getLayer('traffic-point')) map.removeLayer('traffic-point');
    if (map.getSource('traffic-points')) map.removeSource('traffic-points');

    map.addSource('traffic-points', {
        type: 'geojson',
        data: trafficData
    });

    map.addLayer({
        id: 'traffic-symbols',
        type: 'heatmap',
        source: 'traffic-points',
        maxzoom: 15,
        paint: {
            'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['to-number', ['get', `AADT_${year}`]], // Ensure AADT is read as an integer
                1, 0,
                5000, 0.2, 
                10000, 0.4, 
                20000, 0.6,
                50000, 0.8,
                100000, 1
            ],
            'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                11, 1,
                15, 3
            ],
            // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
            // Begin color ramp at 0-stop with a 0-transparency color
            // to create a blur-like effect.
            'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0, 'rgba(8,81,156,0)',
                0.2, 'rgb(8,81,156)',
                0.4, 'rgb(49,130,189)',
                0.6, 'rgb(107,174,214)',
                0.8, 'rgb(189,215,231)',
                1, 'rgb(239,243,255)'
            ],
            // Adjust the heatmap radius by zoom level
            'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10, 11,
                18, 25
            ],
             'heatmap-opacity': {
                default: 1,
                stops: [
                [14, 1],
                [15, 0]
]
}
        }
    });
    map.addLayer(
{
id: 'traffic-point',
type: 'circle',
source: 'traffic-points',
minzoom: 14,
paint: {
  'circle-radius': {
    stops: [
      [15, 7],
      [22, 36]
    ]
  },
  'circle-color': [
    'interpolate',
                    ['linear'],
                    ['to-number', ['get', `AADT_${year}`]],
                    1, 'rgba(8,81,156,0)',
                    5000, 'rgb(8,81,156)',
                    10000, 'rgb(49,130,189)',
                    20000, 'rgb(107,174,214)',
                    50000, 'rgb(189,215,231)',
                    100000, 'rgb(239,243,255)'
  ],
  'circle-stroke-color': 'white',
  'circle-stroke-width': 1,
  'circle-opacity': {
    stops: [
      [14, 0],
      [15, 1]
    ]
  }
}
},

);

map.on('click', 'traffic-point', (event) => {
const properties = event.features[0].properties;
new mapboxgl.Popup()
    .setLngLat(event.features[0].geometry.coordinates)
    .setHTML(`<strong>Road:</strong> ${properties.desc}<br><strong>Average Annual Daily Traffic:</strong> ${properties[`AADT_${year}`]}`)
    .addTo(map);
});

// Update click event for collision points
map.on('click', 'collision-heatmap', (event) => {
const properties = event.features[0].properties;
new mapboxgl.Popup()
    .setLngLat(event.features[0].geometry.coordinates)
    .setHTML(`
        <strong>Location:</strong> ${properties.on_street_name}<br>
        <strong>Number of collisions:</strong> ${properties.crash_count}<br>
        <strong>Injuries:</strong> ${properties.number_of_persons_injured}<br>
        <strong>Deaths:</strong> ${properties.number_of_persons_killed}
    `)
    .addTo(map);
});

};

const updateMap = async (year) => {
const collisionData = await loadGeoJSON(collisionGeojsonFiles[year]);

if (map.getLayer('collision-heatmap')) map.removeLayer('collision-heatmap');
if (map.getSource('collision-points')) map.removeSource('collision-points');

map.addSource('collision-points', {
    type: 'geojson',
    data: collisionData
});

// Heatmap layer
map.addLayer({
    id: 'collision-heatmap',
    type: 'heatmap',
    source: 'collision-points',
    layout: {
        'visibility': 'none' // Hide by default
    },
    paint: {
        // Increase the heatmap weight based on crash count
        'heatmap-weight': [
            'interpolate',
            ['linear'],
            ['get', 'crash_count'],
            0, 0,
            10, 1
        ],
        // Increase the heatmap color weight weight by zoom level
        // heatmap-intensity is a multiplier on top of heatmap-weight
        'heatmap-intensity': [
            'interpolate',
            ['linear'],
            ['zoom'],
            11, 1,
            15, 3
        ],
        // Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
        // Begin color ramp at 0-stop with a 0-transparency color
        // to create a blur-like effect.
        'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(33,102,172,0)',
            0.2, 'rgb(254,240,217)',
            0.4, 'rgb(253,204,138)',
            0.6, 'rgb(252,141,89)',
            0.8, 'rgb(227,74,51)',
            1, 'rgb(179,0,0)'
        ],
        // Adjust the heatmap radius by zoom level
        'heatmap-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            10, 11,
            18, 25
        ],
        // Set the heatmap opacity
        'heatmap-opacity': 0.5
    }
});
};

const updateChart = async (year) => {
const trafficData = await loadGeoJSON(trafficGeojsonFiles[year]);
const collisionData = await loadGeoJSON(collisionGeojsonFiles[year]);

// Calculate average daily traffic, total injuries, and total deaths
let totalTraffic = 0;
let totalInjuries = 0;
let totalDeaths = 0;

trafficData.features.forEach(feature => {
    totalTraffic += parseInt(feature.properties[`AADT_${year}`]) || 0;
});

const averageTraffic = totalTraffic / trafficData.features.length;

collisionData.features.forEach(feature => {
    totalInjuries += parseInt(feature.properties.number_of_persons_injured) || 0;
    totalDeaths += parseInt(feature.properties.number_of_persons_killed) || 0;
});

// Generate the chart using C3.js
const chart = c3.generate({
    bindto: '#chart',
    data: {
        columns: [
            ['Average Traffic', averageTraffic],
            ['Injuries', totalInjuries],
            ['Deaths', totalDeaths]
        ],
        type: 'bar'
    },
    bar: {
        width: {
            ratio: 0.5
        }
    },
    axis: {
        x: {
            type: 'category',
            categories: ['Metrics']
        }
    },
    color: {
        pattern: ['#1f77b4', '#ff7f0e', '#d62728']
    }
});
};

document.getElementById('yearSlider').addEventListener('input', (event) => {
const year = event.target.value;
document.getElementById('active-year').textContent = year;
updateMap(year);
updateTrafficLayer(year);
updateChart(year);
});

document.getElementById('toggleCrashLayer').addEventListener('change', (event) => {
const visibility = event.target.checked ? 'visible' : 'none';
map.setLayoutProperty('collision-heatmap', 'visibility', visibility);
});

updateMap(2020);
updateTrafficLayer(2020);
updateChart(2020);
