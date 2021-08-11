    // Initialize the map
    var map = L.map('map').setView([51.505, -0.09], 24);

    // add tile layer to the map    
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoia2FzcmFrbiIsImEiOiJja3JkMXRmenM0YXdnMndzNjJvbzc3aXcyIn0.QXglz9QtGdb9urz-MM127A', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        // maxZoom: 20,
        id: 'mapbox/streets-v11',
        // tileSize: 512,
        // zoomOffset: -1,
        accessToken: 'pk.eyJ1Ijoia2FzcmFrbiIsImEiOiJja3JkMXRmenM0YXdnMndzNjJvbzc3aXcyIn0.QXglz9QtGdb9urz-MM127A'
    });
    osm.addTo(map);

    L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    .openPopup();

    // Add another marker to the map
    var marker2 = L.marker([51.5, -0.1]).addTo(map)
    .bindPopup('<b>second popup</b>'); 

    var circle = L.circle([51.508, -0.11], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.1,
        radius: 500,
    }).addTo(map);


    var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
        [51.490, -0.047]
    ], {
        color: 'green',
        fillColor: 'grey',
        fillOpacity: 0.15,
    }).addTo(map);

    // marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    circle.bindPopup("I am a circle.");
    polygon.bindPopup("I am a polygon.");

    // Use popups ad tiles (standalone popup)
    var popup = L.popup()
    .setLatLng([51.5, -0.0902])
    .setContent("I am a standalone popup.")
    // .addTo(map);
    .openOn(map)

    var popup = L.popup();

    // function onMapClick(e) {
    //     popup
    //         .setLatLng(e.latlng)
    //         .setContent("You clicked the map at " + e.latlng.toString())
    //         .openOn(map);
        
    //     console.log(e.latlng.toString())
    // }
    
    // map.on('click', onMapClick);
    map.on('click', e => {
        lat = e.lat
        long = e.long
        const xttp = new XMLHttpRequest()
        xttp.open("GET", "http://127.0.0.1:8000/isochrone/get/");
        // xttp.setRequestHeader("lat", lat)
        // xttp.setRequestHeader("long", long)
        xttp.send("latitudeeeeeeee")
        console.log("response:   " + xttp.responseText)
    })