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
    style: 'mapbox://styles/edwardp7/cm85ct1y0005901r00x0bggpr',
    center: [-122.3321, 47.6062], // Seattle coordinates
    zoom: 10
});

map.on('load', async () => {
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
      2024: 'assets/Seattle_Collisions_2024_optimized.geojson',
      2025: 'assets/Seattle_Collisions_2025_optimized.geojson'
  };

  const loadGeoJSON = async (files, year) => {
      const response = await fetch(files[year]);
      return await response.json();
  };

  const addTrafficLayers = (data) => {
      if (map.getSource('traffic-flow')) {
          map.removeLayer('traffic-heat');
          map.removeSource('traffic-flow');
      }
      map.addSource('traffic-flow', {
          type: 'geojson',
          data: data
      });

      map.addLayer({
          id: 'traffic-heat',
          type: 'heatmap',
          source: 'traffic-flow',
          maxzoom: 15,
          paint: {
              'heatmap-weight': {
                  property: 'traffic',
                  type: 'exponential',
                  stops: [
                      [1, 0],
                      [100, 1]
                  ]
              },
              'heatmap-intensity': {
                  stops: [
                      [11, 1],
                      [15, 3]
                  ]
              },
              'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0,
                  'rgba(255, 255, 255, 0)',       // Low
                  0.2,
                  'rgb(255, 255, 255)',          // Low
                  0.4,
                  'rgb(255,255,0)',        // Moderate
                  0.6,
                  'rgb(255,191,0)',        // High
                  0.8,
                  'rgb(255,128,0)',        // Very High
                  1,
                  'rgb(255,0,0)'           // Extreme
              ],
              'heatmap-radius': {
                  stops: [
                      [11, 15],
                      [15, 20]
                  ]
              },
              'heatmap-opacity': {
                  default: 1,
                  stops: [
                      [14, 1],
                      [15, 0]
                  ]
              }
          }
      });
  };

  const addCollisionLayers = (data) => {
      if (map.getSource('collision-points')) {
          map.removeLayer('collision-unclustered-point');
          map.removeLayer('collision-clusters');
          map.removeLayer('collision-cluster-count');
          map.removeSource('collision-points');
      }
      map.addSource('collision-points', {
          type: 'geojson',
          data: data,
          cluster: true,
          clusterMaxZoom: 15,
          clusterRadius: 50 
      });

      map.addLayer({
          id: 'collision-clusters',
          type: 'circle',
          source: 'collision-points',
          filter: ['has', 'point_count'],
          paint: {
              'circle-color': [
                  'step',
                  ['get', 'point_count'],
                  '#51bbd6',
                  10,
                  '#f1f075',
                  30,
                  '#f28cb1'
              ],
              'circle-radius': [
                  'step',
                  ['get', 'point_count'],
                  15,
                  10,
                  20,
                  30,
                  25
              ]
          }
      });

      map.addLayer({
          id: 'collision-cluster-count',
          type: 'symbol',
          source: 'collision-points',
          filter: ['has', 'point_count'],
          layout: {
              'text-field': '{point_count_abbreviated}',
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 12
          }
      });

      map.addLayer({
          id: 'collision-unclustered-point',
          type: 'circle',
          source: 'collision-points',
          filter: ['!', ['has', 'point_count']],
          paint: {
              'circle-color': '#0000FF',
              'circle-radius': 5,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#FFFFFF'
          }
      });
  };

  const updateMap = async (year) => {
      const trafficData = await loadGeoJSON(trafficGeojsonFiles, year);
      const collisionData = await loadGeoJSON(collisionGeojsonFiles, year);
      if (map.getSource('traffic-flow')) {
          map.getSource('traffic-flow').setData(trafficData);
      } else {
          addTrafficLayers(trafficData);
      }
      if (map.getSource('collision-points')) {
          map.getSource('collision-points').setData(collisionData);
      } else {
          addCollisionLayers(collisionData);
      }
  };

  document.getElementById('yearSlider').addEventListener('input', (event) => {
      const year = event.target.value;
      document.getElementById('active-year').textContent = year;
      updateMap(year);
  });

  const initialTrafficData = await loadGeoJSON(trafficGeojsonFiles, 2020);
  const initialCollisionData = await loadGeoJSON(collisionGeojsonFiles, 2020);
  addTrafficLayers(initialTrafficData);
  addCollisionLayers(initialCollisionData);
});
