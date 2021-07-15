// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createMap(data.features);
});
function createMap(earthquakeData) {

 //Create our map, giving it the streetmap and earthquakes layers to display on load
  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 2,
   // layers: [streetmap]
  });

  L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

    // Conditionals for countries points
    var info = L.control({
      position: "bottomright"
    });
    
    // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function() {
      var div = L.DomUtil.create("div", "legend");
      return div;
    };
    // Add the info legend to the map
    info.addTo(myMap);

    document.querySelector(".legend").innerHTML = [
      "<p class='green'> <10: Green  </p>",
      "<p class='blue'> 11 - 100: Blue </p>",
      "<p class='yellow'> 101 - 200: yellow</p>",
      "<p class='red'> >200: red </p>",
      
    ].join("");


  // Add circles to map
  for (var i = 0; i < earthquakeData.length; i++) {
      //debugger;
    var color = "";
    if (earthquakeData[i].geometry.coordinates[2] <= 10) {
        color = "green";
    }
    else if (earthquakeData[i].geometry.coordinates[2] >= 11 && earthquakeData[i].geometry.coordinates[2] <= 100) {
        color = "blue";
    }
    else if (earthquakeData[i].geometry.coordinates[2] >= 101 && earthquakeData[i].geometry.coordinates[2] <= 200) {
        color = "yellow";
    }
    else {
        color = "red";
    }

    
    L.circleMarker([earthquakeData[i].geometry.coordinates[1],earthquakeData[i].geometry.coordinates[0]], {
        fillOpacity: 0.75,
        color: "white",
        fillColor: color,
        // Adjust radius
        radius: earthquakeData[i].properties.mag*4
    }).bindPopup("<h3>" + earthquakeData[i].properties.place +
            "</h3><hr><p>" + new Date(earthquakeData[i].properties.time) + "</p>" +
            "</h3><hr><p> magnitudes: " + earthquakeData[i].properties.mag + "</p>" +
            "</h3><hr><p> depth: " + earthquakeData[i].geometry.coordinates[2] + "</p>" ).addTo(myMap);
    }


}
