
// Requirements:
// Using Leaflet, create a map that plots all the earthquakes from your dataset based on their longitude and latitude.
// Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
// Hint: The depth of the earth can be found as the third coordinate for each earthquake.
// Include popups that provide additional information about the earthquake when its associated marker is clicked.
// Create a legend that will provide context for your map data. 

let myMap = L.map("map", {
    center: [40.866667, 34.566667], //geographical center of earth from https://en.wikipedia.org/wiki/Geographical_centre_of_Earth
    zoom: 2
  });
  
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function (data) {
    createFeatures(data.features);
  });

function createFeatures(data){
    for(i=0;i<data.length;i++){
        feature = data[i];
        let color = markerColor(feature);
        let radius = markerRadius(feature);
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
          ).addTo(myMap);     
    }
}

// determine  marker color by depth
function markerColor(feature){
    depth = feature.geometry.coordinates[2];
    //console.log(depth);
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

// determine marker size by radius
function markerRadius(feature){
    magnitude = feature.properties.mag;
    let mag = 0
    if (magnitude >=0){
        mag = Math.sqrt(magnitude)*1000
    }
    return mag;
    
}

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

legend.addTo(myMap);