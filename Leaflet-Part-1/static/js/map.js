
console.log("map.js");
let myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(url).then(function (data) {
    console.log(data); 
    createFeatures(data.features);
  });

function createFeatures(data){
    for(i=0;i<data.length;i++){
        console.log(data[i].geometry.coordinates);
        let marker = L.marker(
            [data[i].geometry.coordinates[1],data[i].geometry.coordinates[0]], 
            {
            draggable: true,
            title: data[i].properties.place
            }
          ).addTo(myMap);
          
    }
    
}
  
  