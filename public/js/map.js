function moveMapToBerlin(map) {
    // console.log(coordinates);
    // var lat = coordinates[0];
    // var lng = coordinates[1];
    // console.log(lat, lng);
    map.setCenter({ lat:coordinates[0] , lng: coordinates[1] });
    map.setZoom(14);
}
var platform = new H.service.Platform({
    apikey: mapToken,
});
var defaultLayers = platform.createDefaultLayers();

var map = new H.Map(document.getElementById('map'),
    defaultLayers.vector.normal.map, {
    center: { lat: 50, lng: 5 },
    zoom: 4,
    pixelRatio: window.devicePixelRatio || 1
});
// add a resize listener to make sure that the map occupies the whole container
window.addEventListener('resize', () => map.getViewPort().resize());

//Step 3: make the map interactive
// MapEvents enables the event system
// Behavior implements default interactions for pan/zoom (also on mobile touch environments)
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Create the default UI components
var ui = H.ui.UI.createDefault(map, defaultLayers);

var svg = '<svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">' +
    '<path fill="#2D6AC4" d="M12 2C8.13 2 5 5.13 5 9c0 4.97 7 13 7 13s7-8.03 7-13c0-3.87-3.13-7-7-7z"/>' +
    '<circle cx="12" cy="9" r="4" fill="#FFFFFF"/>' +
    '</svg>';

var icon = new H.map.Icon(svg, {
    anchor: { x: 24, y: 58 }
});

// console.log(coordinates);
// var lat = coordinates[0];
// var lng = coordinates[1];
// console.log(lat, lng);
var marker = new H.map.Marker({ lat:coordinates[0] , lng: coordinates[1] }, { icon: icon });
var circle = new H.map.Circle({lat: coordinates[0], lng: coordinates[1]}, 500);

// Add the circle to the map:
map.addObject(circle);

// Add the marker to the map:
map.addObject(marker);


// Now use the map as required...
window.onload = function () {
    moveMapToBerlin(map);
}

