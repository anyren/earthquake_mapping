
// Requirements:
// Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.
// Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
// Hint: The depth of the earth can be found as the third coordinate for each earthquake.
// Include popups that provide additional information about the earthquake when its associated marker is clicked.
// Create a legend that will provide context for your map data. 
// for Part 2:
// Plot the tectonic plates dataset on the map in addition to the earthquakes.
// Add other base maps to choose from.
// Put each dataset into separate overlays that can be turned on and off independently.
// Add layer controls to our map.

function createMap(earthquakes, plates){

    // tile layers
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    var satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    
    // Create a baseMaps object to hold the tile layers.
    let baseMaps = {
        "Street Map": streetmap,
        "Satellite":satellite
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
    // legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {
      // colors
      var div = L.DomUtil.create('div', 'info legend'),
          depth = [0, 10, 100, 200, 300, 400, 500, '> 500'],
          labels = [];
          colorList = [
              '#fced05',
              '#fdb805',
              '#ef8724',
              '#d35a33',
              '#ac343a',
              '#7e1638',
              '#4d022e'
          ];

      // legend
      div.innerHTML +=
              '<h3> Depth of Earthquake</h3>' ;
      for (var i = 0; i < colorList.length; i++) {
          if (i == colorList.length -1){
              div.innerHTML +=
              '<i style="background:' + colorList[i] + '"></i> ' +
              '>' + depth[i] + ' km' + '<br>' ;
          }
          else if ( i===0){
              div.innerHTML +=
              '<i style="background:' + colorList[i] + '"></i> ' +
              '<' + depth[i + 1] + ' km' + '<br>' ;
          }
          else{
              div.innerHTML +=
              '<i style="background:' + colorList[i] + '"></i> ' +
              depth[i] + '-' + depth[i + 1] + ' km' + '<br>' ;
          }
      }
      div.innerHTML += '<br>'
  return div;
  };

  legend.addTo(map);
};

// determine  marker color by depth
function markerColor(feature){
  depth = feature.geometry.coordinates[2];
  let color = "black";
  let colorList=[
      '#fced05',
      '#fdb805',
      '#ef8724',
      '#d35a33',
      '#ac343a',
      '#7e1638',
      '#4d022e'

  ];
  // less than 10 km deep
  if(depth<0 || depth < 10){
      color = colorList[0];
  }
  // 10-100 km
  else if(depth <100){
      color= colorList[1];
  }
  // 100-200km
  else if(depth < 200){
      color=colorList[2];
  }
  // 200-300 km
  else if (depth <300){
      color=colorList[3];
  }
  // 300-400km
  else if (depth <400){
      color = colorList[4];
  }
  // 400-500
  else if (depth < 500){
      color=colorList[5];
  }
  //>500
  else if(depth >=500){
      color=colorList[6];
  }
  return color;
}



//function to create markers
let earthquakeLayer=L.layerGroup(null);
function createMarkers(){
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    d3.json(url).then(function (data) {
        features = data.features
        for(i=0;i<features.length;i++){
            feature = features[i];
            let color = markerColor(feature);
            let marker = L.circle([feature.geometry.coordinates[1],feature.geometry.coordinates[0]], {
              title: feature.properties.place,
              color: color,
              fillColor: color,
              fillOpacity: 0.5,
              radius: feature.properties.mag *10000
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
        let feature = features[i];
        let geom = feature.geometry.coordinates;
        let coords = [];
        for(c=0; c<geom.length; c++){
          coords.push([geom[c][1],geom[c][0]])
        };
        console.log(coords);
        let plate = L.polyline([coords], {
            color: "#8D8D8D",
            weight: 2,
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

