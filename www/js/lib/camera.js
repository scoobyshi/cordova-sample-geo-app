function onCameraSuccess(imageURI) {
  var image = document.getElementById('myImage');
  image.src = imageURI;
  var imagePath = document.getElementById('imagePath');
  imagePath.value = imageURI;
}

function onCameraFail(message) {
  alert('Failed because: ' + message);
}

function useCamera() {
  console.log('Camera selected.');

  navigator.camera.getPicture(onCameraSuccess, onCameraFail, { quality: 50,
    destinationType: Camera.DestinationType.FILE_URI });
}