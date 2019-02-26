var map = null;
var currentDescription = null;
var currentLocation = {
  coords: {
    latitude: null,
    longitude: null,
  },
};
var currentImage = null;

function updateScreenLocation(coords) {
  document.getElementById("latitude").innerHTML = coords.latitude;
  document.getElementById("longitude").innerHTML = coords.longitude;
}

async function clickLocation() {
  console.log('Location button click.');
  // Update Location
  currentLocation = await geoCurrentLocation();
  console.log('Awaited, Updated, Location:', currentLocation);

  updateScreenLocation(currentLocation.coords);  
}

async function updateSql() {
  var updateDescription = document.forms["sqlForm"]["description"].value;
  var updateImagePath = document.forms["sqlForm"]["imagePath"].value;
  
  console.log('Picture URI?', updateImagePath)

  try {
    var response = await addRecord('default', updateDescription, currentLocation.coords.latitude, currentLocation.coords.longitude, updateImagePath);
    if (response.ok) {
      currentDescription = updateDescription
      currentImage = updateImagePath;
    }
  } catch (error) {
    console.log('Failed to update record.');
  }
}

function clearPreferences() {
  clearTable();

  currentDescription = '';
  document.getElementById("description").placeholder = currentDescription;
  document.getElementById("description").value = currentDescription;
  
  currentImage = null;
  document.getElementById("myImage").src = currentImage;

  M.updateTextFields();
}

function updateMap() {
  console.log('Map button click.');

  var latitude = currentLocation.coords.latitude ? currentLocation.coords.latitude : 49.290051;
  var longitude = currentLocation.coords.longitude ? currentLocation.coords.longitude : -123.132809;

  // Move to the position with animation
  map.animateCamera({
    target: {
      lat: latitude,
      lng: longitude,
    },
    zoom: 17,
    tilt: 60,
    bearing: 140,
    duration: 5000
  });

  var canvas = document.createElement('canvas');
  canvas.width = 140;
  canvas.height = 60;
  var context = canvas.getContext('2d');

  var img = new Image();
  if (!currentImage) {
    img.src = 'https://mdn.mozillademos.org/files/5399/gallery_1.jpg'
  } else {
    img.src = currentImage;
  }
  var mapSnippet = currentDescription;

  img.onload = function() {
    context.drawImage(img, 0, 0, 50, 50);
    context.font = '10pt Calibri';
    context.fillStyle = 'blue';
    context.fillText('Welcome to', 60, 15);
    context.fillText('Cordova!', 60, 30);

    var marker = map.addMarker({
      position: {
        lat: latitude,
        lng: longitude,
      },
      // title: "Welcome to\n Cordova!",
      title: canvas.toDataURL(),
      snippet: mapSnippet,
      animation: plugin.google.maps.Animation.BOUNCE
    });
    
    marker.showInfoWindow();
  };
}

// Initialize all Materialize components (but without options)
document.addEventListener('DOMContentLoaded', function() {
  M.AutoInit();
});

document.addEventListener("deviceready", async function() {
  console.log('App is device ready...');

  // Initialize a DB
  try {
    initDatabase('test.db');

    var resultResponse = await getSqlResults();

    currentDescription = resultResponse.rows.item(0).description;
    document.getElementById("description").placeholder = currentDescription;
    
    if (resultResponse.rows.item(0).picture !== '') {
      currentImage = resultResponse.rows.item(0).picture;
      document.getElementById("myImage").src = currentImage;
    }

    M.updateTextFields();
  } catch (error) {
    console.log('DB Error Message:', error.message);
  }

  // Initialize Background Geolocation
  try {
    console.log('Geo Initialize...');
    currentLocation = await geoInitialize();
    console.log('Awaited Location:', currentLocation);

    updateScreenLocation(currentLocation.coords);
  } catch (error) {
    alert('Error Message:', error.message);
  }

  // Create a Google Maps native view under the map_canvas div.
  // careful with html buttons on map as may interrupt transparency on iOS
  var div = document.getElementById("map_canvas");
  map = plugin.google.maps.Map.getMap(div);

  // If you click the map button...
  var mapButton = document.getElementById("map_button");
  mapButton.addEventListener("click", updateMap);

  // If you click the Camera button...
  var picButton = document.getElementById("pic_button");
  picButton.addEventListener("click", useCamera);

  // If you click the Location button...
  var locationButton = document.getElementById("loc_button");
  locationButton.addEventListener("click", clickLocation);

}, false);