mapbox_token = "pk.eyJ1Ijoia2FzcmFrbiIsImEiOiJja3JkMXRmenM0YXdnMndzNjJvbzc3aXcyIn0.QXglz9QtGdb9urz-MM127A"

var map = L.map('map').setView([39.74, -104.99], 10);

L.tileLayer('https://api.mapbox.com/styles/v1/kasrakn/ckreaanlx2lgd18qyfbw7fgof/tiles/{z}/{x}/{y}?access_token=' + mapbox_token, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1  
}).addTo(map);

var littleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.'),
    denver    = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.'),
    aurora    = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.'),
    golden    = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.');

var cities = L.layerGroup([littleton, denver, aurora, golden]).addTo(map)

var grayscale = L.tileLayer(mapboxUrl, {id: 'MapID', tileSize: 512, zoomOffset: -1, attribution: mapbox Attribution}),
    streets   = L.tileLayer(mapboxUrl, {id: 'MapID', tileSize: 512, zoomOffset: -1, attribution: mapboxAttribution});

var map = L.map('map', {
    center: [39.73, -104.99],
    zoom: 10,
    layers: [grayscale, cities]
});