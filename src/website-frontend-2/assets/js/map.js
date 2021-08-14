function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}


var map = L.map('map').fitWorld();

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
    minZoom: 3
    // tileSize: 512,
    // zoomOffset: -1  
}).addTo(map);

// zooming the map view to the detected location
// at first the access to the location is being asked from the user
// map will set the view to the users current location after the getting the access to it.
// maxZoom sets the zoom when the view is being set
map.locate({setView: true, maxZoom: 16});
map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

