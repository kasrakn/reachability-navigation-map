var map = L.map('map').fitWorld();

L.tileLayer('https://api.mapbox.com/styles/v1/kasrakn/ckreaanlx2lgd18qyfbw7fgof/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2FzcmFrbiIsImEiOiJja3JkMXRmenM0YXdnMndzNjJvbzc3aXcyIn0.QXglz9QtGdb9urz-MM127A', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1  
}).addTo(map);

// zooming the map view to the detected location
// at first the access to the location is being asked from the user
// map will set the view to the users current location after the getting the access to it.
// maxZoom sets the zoom when the view is being set
current_loc = map.locate({setView: true, maxZoom: 16}, (e) => {
    console.log(e)
});



function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

    L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);


function onLocationError(e) {
    alert(e.message);
}

map.on('locationerror', onLocationError);

