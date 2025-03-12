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
            center: [-74.006, 40.7128],
            zoom: 10
        });

        const collisionGeojsonFiles = {
            2020: 'assets/nyc_crashes_2020.geojson',
            2021: 'assets/nyc_crashes_2021.geojson',
            2022: 'assets/nyc_crashes_2022.geojson',
            2023: 'assets/nyc_crashes_2023.geojson',
            2024: 'assets/nyc_crashes_2024.geojson',
            2025: 'assets/nyc_crashes_2025.geojson'
        };

        const loadGeoJSON = async (file) => {
            const response = await fetch(file + "?t=" + new Date().getTime());
            return await response.json();
        };

        const updateMap = async (year) => {
            const collisionData = await loadGeoJSON(collisionGeojsonFiles[year]);

            if (map.getLayer('collision-cluster')) map.removeLayer('collision-cluster');
            if (map.getLayer('collision-count')) map.removeLayer('collision-count');
            if (map.getLayer('collision-points')) map.removeLayer('collision-points');
            if (map.getSource('collision-points')) map.removeSource('collision-points');

            map.addSource('collision-points', {
                type: 'geojson',
                data: collisionData,
                cluster: true,
                clusterMaxZoom: 14,
                clusterRadius: 50
            });

            // Clustering layer
            map.addLayer({
                id: 'collision-cluster',
                type: 'circle',
                source: 'collision-points',
                filter: ['has', 'point_count'],
                paint: {
                    'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#51bbd6', 100,
                        '#f1f075', 1000,
                        '#f28cb1'
                    ],
                    'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        15, 10,
                        20, 30,
                        25
                    ]
                }
            });

            // Cluster count labels
            map.addLayer({
                id: 'collision-count',
                type: 'symbol',
                source: 'collision-points',
                filter: ['has', 'point_count'],
                layout: {
                    'text-field': '{point_count_abbreviated}',
                    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                    'text-size': 12
                },
                paint: {
                    'text-color': '#000'
                }
            });

            // Individual collision points
            map.addLayer({
                id: 'collision-points',
                type: 'circle',
                source: 'collision-points',
                filter: ['!', ['has', 'point_count']],
                paint: {
                    'circle-radius': 5,
                    'circle-color': '#0000FF'
                }
            });
        };

        document.getElementById('yearSlider').addEventListener('input', (event) => {
            const year = event.target.value;
            document.getElementById('active-year').textContent = year;
            updateMap(year);
        });

        updateMap(2020);
