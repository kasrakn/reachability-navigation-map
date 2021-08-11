// Initialize the map
var map = L.map('map').setView([51.505, -0.09], 16);

// add tile layer to the map    
L.tileLayer('https://api.mapbox.com/styles/v1/kasrakn/ckreaanlx2lgd18qyfbw7fgof/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoia2FzcmFrbiIsImEiOiJja3JkMXRmenM0YXdnMndzNjJvbzc3aXcyIn0.QXglz9QtGdb9urz-MM127A', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1  
}).addTo(map);

function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    console.log(feature.properties)
    if (feature.properties && feature.properties.popupContent) {
        layer.bindPopup(feature.properties.popupContent);
    }
}

var geojsonFeature = {
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "amenity": "Baseball Stadium",
        "popupContent": "This is where the Rockies play!"
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-0.09, 51.505]
    }
};

// The onEachFeature option is a function that gets called on each feature 
// before adding it to a GeoJSON layer. A common reason to use this option 
// is to attach a popup to features when they are clicked.
L.geoJSON(geojsonFeature, {
    onEachFeature: onEachFeature
}).addTo(map);



var someFeatures = [{
    "type": "Feature",
    "properties": {
        "name": "Coors Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-0.1, 51.525]
    }
}, {
    "type": "Feature",
    "properties": {
        "name": "Busch Field",
        "show_on_map": true
    },
    "geometry": {
        "type": "Point",
        "coordinates": [-0.1, 51.528]
    }
}];

L.geoJSON(someFeatures, {
    filter: function(feature, layer) {
        return feature.properties.show_on_map;
    }
}).addTo(map);
