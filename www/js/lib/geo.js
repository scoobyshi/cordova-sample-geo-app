var bgGeo = null;

async function geoCurrentLocation() {
  var currentLocation = await bgGeo.getCurrentPosition();
  return currentLocation;
}

async function geoInitialize() {
  return new Promise(async (resolve) => {
    bgGeo = window.BackgroundGeolocation;
    var options = {
      reset: true,
      debug: true,
      logLevel: bgGeo.LOG_LEVEL_VERBOSE,
      desiredAccuracy: bgGeo.DESIRED_ACCURACY_HIGH,
      distanceFilter: 10,
      autoSync: true,
      stopOnTerminate: false,
      startOnBoot: true
    };

    bgGeo.onMotionChange(function(event) {
      console.log('[motionchange] -', event.isMoving, event.location);
    });

    try {
      var state = await bgGeo.ready(options);
      console.log('Geo Ready State:', state);
    } catch (error) {
      console.log('Geo NOT Ready State:', error);
    }

    if (state) {
      if (state.enabled) {
        console.log('Get Current Position...');
        var currentLocation = await bgGeo.getCurrentPosition();
        console.log('Background Geolocation is Ready:', currentLocation);
        resolve(currentLocation);
      } else if (!state.enabled) {
        // If we don't trigger this method, it won't invoke the location prompt in iOS to accept
        // thus not allowing access to location services
        bgGeo.start().then(function() {
          console.log('- BackgroundGeolocation tracking started');
        });
      }
    }
  });
}
