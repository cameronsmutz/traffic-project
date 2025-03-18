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
    center: [-122.3321, 47.6062], // Seattle coordinates
    zoom: 10.5
});

const trafficGeojsonFiles = {
    2020: 'assets/seattle_traffic_2020.geojson',
    2021: 'assets/seattle_traffic_2021.geojson',
    2022: 'assets/seattle_traffic_2022.geojson',
    2023: 'assets/seattle_traffic_2023.geojson',
};

const collisionGeojsonFiles = {
    2020: 'assets/Seattle_Collisions_2020_optimized.geojson',
    2021: 'assets/Seattle_Collisions_2021_optimized.geojson',
    2022: 'assets/Seattle_Collisions_2022_optimized.geojson',
    2023: 'assets/Seattle_Collisions_2023_optimized.geojson',
};

const loadGeoJSON = async (file) => {
    const response = await fetch(file + "?t=" + new Date().getTime());
    return await response.json();
};

const updateTrafficLayer = async (year) => {
    const trafficData = await loadGeoJSON(trafficGeojsonFiles[year]);

    // Filter out duplicate traffic count points on the same coordinate
    const uniqueTrafficData = {
        type: 'FeatureCollection',
        features: []
    };
    const seenCoordinates = new Set();

    trafficData.features.forEach(feature => {
        const coordinates = feature.geometry.coordinates.join(',');
        if (!seenCoordinates.has(coordinates)) {
            seenCoordinates.add(coordinates);
            uniqueTrafficData.features.push(feature);
        }
    });

    if (map.getLayer('traffic-symbols')) map.removeLayer('traffic-symbols');
    if (map.getLayer('traffic-point')) map.removeLayer('traffic-point');
    if (map.getSource('traffic-points')) map.removeSource('traffic-points');

    map.addSource('traffic-points', {
        type: 'geojson',
        data: uniqueTrafficData
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
                ['get', `STUDY_ADT`], // Ensure STUDY_ADT is read as an integer
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

    map.addLayer({
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
                ['get', `STUDY_ADT`],
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
    });

    map.on('click', 'traffic-point', (event) => {
        const properties = event.features[0].properties;
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>Road:</strong> ${properties.STDY_TITLE_PART}<br><strong>Average Daily Traffic:</strong> ${properties.STUDY_ADT}`)
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

    map.addLayer({
        id: 'collision-heatmap',
        type: 'heatmap',
        source: 'collision-points',
        layout: {
            'visibility': 'none' // Hide by default
        },
        paint: {
            'heatmap-weight': 0.1,
            'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                11, 1,
                15, 3
            ],
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
            'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                10, 11,
                18, 25
            ],
            'heatmap-opacity': 0.5
        }
    });

    map.on('click', 'collision-heatmap', (event) => {
        const properties = event.features[0].properties;
        const totalInjuries = (parseInt(properties.INJURIES) || 0) + (parseInt(properties.SERIOUSINJURIES) || 0);
        const totalDeaths = parseInt(properties.FATALITIES) || 0;
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`
                <strong>Location:</strong> ${properties.LOCATION}<br>
                <strong>Collisions:</strong> ${properties.VEHCOUNT}<br>
                <strong>Injuries:</strong> ${totalInjuries}<br>
                <strong>Deaths:</strong> ${totalDeaths}
            `)
            .addTo(map);
    });
};

document.getElementById('yearSlider').addEventListener('input', (event) => {
    const year = event.target.value;
    document.getElementById('active-year').textContent = year;
    updateMap(year);
    updateTrafficLayer(year);
});

document.getElementById('toggleCrashLayer').addEventListener('change', (event) => {
    const visibility = event.target.checked ? 'visible' : 'none';
    map.setLayoutProperty('collision-heatmap', 'visibility', visibility);
});

updateMap(2020);
updateTrafficLayer(2020);
