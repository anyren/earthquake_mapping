
// Requirements:
// Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.
// Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
// Hint: The depth of the earth can be found as the third coordinate for each earthquake.
// Include popups that provide additional information about the earthquake when its associated marker is clicked.
// Create a legend that will provide context for your map data. 




// let earthquakes = d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(createFeatures);
// d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(createPlates);

function createMap(earthquakes, plates){

    // tile layers
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    
    // Create a baseMaps object to hold the tile layers.
    let baseMaps = {
        "Street Map": streetmap
      };
    
    // Create an overlayMaps object 
    let overlayMaps = {
        "Earthquakes": earthquakes,
        "Techtonic Plates": plates
      }
    // Create the map object with options.
    let map = L.map("map", {
        center: [40.866667, 34.566667], //geographical center of earth from https://en.wikipedia.org/wiki/Geographical_centre_of_Earth
        zoom: 2,
        layers: [streetmap, earthquakes, plates]
      });
    
    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);
    
    // create legend and add to map
}

//function to create markers
let earthquakeLayer=L.layerGroup(null);
function createMarkers(){
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    d3.json(url).then(function (data) {
        features = data.features
        for(i=0;i<features.length;i++){
            feature = features[i];
            let marker = L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
                draggable: true,
                title: feature.properties.place,
                fillOpacity: 0.5,
            }
            ).bindPopup("<strong>" + feature.properties.place + "</strong><br>" + 
            Date(feature.properties.time) + "<hr />" + 
            "depth: " +  feature.geometry.coordinates[2] + " km <br>magnitude: " + feature.properties.mag 
            )
            earthquakeLayer.addLayer(marker);  
        }
    
    });
}
let plateLayer = L.layerGroup(null);
function createPlates(){
  url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
  d3.json(url).then(function (data) {
    features = data.features
    for(i=0;i<features.length;i++){
        feature = features[i];
        let plate = L.polyline([feature.geometry.coordinates], {
            color: "black",
            weight: 1,
        }
        )
        plateLayer.addLayer(plate);  
    }
  });
}

// call createMap
createMarkers();
createPlates();
createMap(earthquakeLayer, plateLayer);

