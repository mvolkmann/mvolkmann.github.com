/*jslint broswer: true, indent: 2 */
/*global alert: true, document: true, google: true, navigator: true,
         window: true */

var TIMEOUT = 50000;

function $(id) {
  return document.getElementById(id);
}

// Perform "reverse geocoding".
function getAddress(latLng) {
  var geocoder = new google.maps.Geocoder();
  //alert('calling geocode');
  geocoder.geocode(latLng, function (results, status) {
    //alert('returned from geocode');
    if (status === google.maps.GeocoderStatus.OK) {
      alert('address = ' + results[0].formatted_address);
    } else {
      alert('status = ' + status);
    }
  });
  //alert('called geocode');
}

function setText(id, text) {
  $(id).textContent = text;
}

function status(msg) {
  setText('status', msg);
}

function positionSuccess(position) {
  var latitude, latLng, longitude, map, marker, options;

  status('got location');

  latitude = position.coords.latitude;
  setText('latitude', latitude);

  longitude = position.coords.longitude;
  setText('longitude', longitude);

  // See http://code.google.com/apis/maps/
  // documentation/javascript/tutorial.html.
  latLng = new google.maps.LatLng(latitude, longitude);
  options = {
    zoom: 15,
    center: latLng,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  status('getting map');
  map = new google.maps.Map(
    document.getElementById('map'), options);
  status('finished');

  marker = new google.maps.Marker({
    position: latLng, 
    map: map, 
    title: 'You Are Here' // tooltip
  });   

  getAddress(latLng);
}

function positionError(error) {
  if (error.code === error.TIMEOUT) {
    status('getCurrentPosition ' + error.message);
  } else {
    status('getCurrentPosition ' + error + ' ' + error.message);
  }
}

window.onload = function () {
  status('getting location with timeout of ' + TIMEOUT);
  // See http://dev.w3.org/geo/api/spec-source.html.
  navigator.geolocation.getCurrentPosition(
    positionSuccess,
    positionError,
    // if timeout occurs, use cached value up to 5 minutes old.
    { maximumAge: 300000,
      timeout: TIMEOUT });
};
