// Define the exact California bounding box
var californiaBounds = [
    [31.5, -125], // Extended slightly southwest (beyond San Diego & Pacific)
    [42.5, -113.5]  // Extended slightly northeast (past Oregon/Nevada border)
];

// Initialize the map with California bounds
var map = L.map('map', {
    center: [37.2, -119.5], // Adjusted center
    zoom: 5.5, // Balanced zoom level
    minZoom: 5,
    maxZoom: 10,
    maxBounds: californiaBounds,
    maxBoundsViscosity: 0.8
});

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 5,
    maxZoom: 10,
    attribution: '© OpenStreetMap',
    bounds: californiaBounds
}).addTo(map);

// Temperature-based color function
function getColor(temp) {
    return temp > 100 ? '#800026' :
           temp > 90  ? '#BD0026' :
           temp > 80  ? '#E31A1C' :
           temp > 70  ? '#FC4E2A' :
           temp > 60  ? '#FD8D3C' :
           temp > 50  ? '#FEB24C' :
           temp > 40  ? '#FED976' :
                        '#FFEDA0';
}

// Style function for counties
function style(feature) {
    return {
        fillColor: getColor(feature.properties.temperature),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

// Interactive county info box
var info = L.control();
info.onAdd = function () {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
info.update = function (props) {
    this._div.innerHTML = '<h4>California County Wild Fire and Temperatures Watch</h4>' +
        (props ? '<b>' + props.name + '</b><br />' + props.temperature + '°F' : 'Hover over a county');
};
info.addTo(map);

// Highlight feature on hover
function highlightFeature(e) {
    var layer = e.target;
    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    layer.bringToFront();
    info.update(layer.feature.properties);
}

// Reset highlight
function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

// Zoom to county on click
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

// Apply events to each county
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// Load California counties GeoJSON
var geojson;
fetch('california_counties.geojson')
    .then(response => response.json())
    .then(data => {
        geojson = L.geoJson(data, {
            style: style,
            onEachFeature: onEachFeature
        }).addTo(map);
    });

// Add legend with gradient and forecast bar
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [40, 50, 60, 70, 80, 90, 100],
        labels = [];
    
    div.innerHTML = '<h4>Temperature (°F)</h4><div style="background: linear-gradient(to right, #FFEDA0, #FED976, #FEB24C, #FD8D3C, #FC4E2A, #E31A1C, #BD0026, #800026); height: 15px; margin-bottom: 5px;"></div>';
    
    for (var i = 0; i < grades.length; i++) {
        labels.push('<i style="background:' + getColor(grades[i]) + '"></i> ' + grades[i] + (grades[i + 1] ? '–' + grades[i + 1] + '°F' : '+'));
    }
    
    div.innerHTML += labels.join('<br>');
    
    // Add forecast bar
    div.innerHTML += '<h4>Forecast</h4><div id="forecast" style="padding: 5px; background: #f8f8f8; border-radius: 5px;">Loading...</div>';
    return div;
};
legend.addTo(map);

// Function to fetch forecast data (simulated for now)
function updateForecast() {
    document.getElementById('forecast').innerHTML = 'Tomorrow: High of 85°F, Low of 65°F';
}
setTimeout(updateForecast, 1000); // Simulate fetching forecast data

// Restrict dragging beyond bounds
map.on('drag', function () {
    map.panInsideBounds(californiaBounds, { animate: true });
});
