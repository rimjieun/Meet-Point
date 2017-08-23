// Make sure route is secure
// if (location.protocol != 'https:')
// {
//  location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
// }

//DISPLAY MAP AT CURRENT LOCATION********************************
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
      center: {
        lat: Number(position.coords.latitude),
        lng: Number(position.coords.longitude)
      },
      mapTypeControlOptions: {
        mapTypeIds: []
      }
    });
  });
} else {
  console.log('Geolocation is not supported by this browser.');
}

//ADDRESS FIELD AUTOCOMPLETE*************************************
var autocomplete = new google.maps.places.Autocomplete(document.getElementById('address-input'));


//MODALS*********************************************************
$('.modal').modal();

$('#group-modal-btn').on('click', function() {
  $('#group-info').modal('open');
});

$('#person-modal-btn').on('click', function() {
  $('#new-member-form').modal('open');
});

//VARIABLES******************************************************
var map;
var midMarker;
var markerColors = ['red', 'yellow', 'green', 'blue', 'purple'];
var tempColors = [];

//CLEAR INPUT FIELDS**********************************************
function clearInputFields() {
  // Empty input fields
  $('#name-input').val('');
  $('#address-input').val('');
}

//CREATE PERSON MARKER********************************************
function createPersonMarker(lat, lng) {

  // Create icon to be used as marker
  var icon = {
    url: 'assets/img/' + color + '-marker.png', // url
    scaledSize: new google.maps.Size(50, 50), // scaled size
    origin: new google.maps.Point(0, 0), // origin
    anchor: new google.maps.Point(0, 0) // anchor
  };

  // Add marker on map
  var personMarker = new google.maps.Marker({
    icon: icon,
    animation: google.maps.Animation.DROP,
    position: {
      lat: lat,
      lng: lng
    },
    map: map
  });
}

//CREATE MEAN MARKER***********************************************
function createMeanMarker(lat, lng) {
  midMarker = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    draggable: true,
    position: {
      lat: lat,
      lng: lng
    },
    map: map
  });
}


//CONVERT ADDRESS TO COORDINATES************************************
function geocode(address) {

  var geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json';
  var geocodeKey = 'AIzaSyBXVMfGC-uz0W8eYzwy85Kv91y6B1902ig';

  geocodeURL += '?' + $.param({
    'api_key': geocodeKey,
    'address': address
  });

  var coords = $.ajax({
    url: geocodeURL,
    method: 'GET',
    async: false
  });

  return coords;
}

//SELECT RANDOM COLOR***********************************************
function selectRandomColor() {
  // If out of colors, refill colors from temp array
  if (markerColors.length === 0) {
    markerColors = tempColors;
    tempColors = [];
  }

  // Select random color for person marker
  var randomIndex = Math.floor(Math.random() * markerColors.length);
  var color = markerColors[randomIndex];
  var temp = markerColors.splice(randomIndex, 1);
  tempColors.push(temp);

  return color;
}

//ADD PERSON TO LIST************************************************
function addPerson(name, address, lat, lng) {
  var newPersonItem = $('<li class="person" data-name="' + name + '" data-address="' + address + '" data-lat="' + lat + '" data-lng="' + lng + '"><div class="person-icon left"><i class="fa fa-user" aria-hidden="true"></i></div><div class="person-info left"><p class="person-name">' + name + '</p><p class="person-address">' + address + '</p></div><div class="person-options"><p><i class="fa fa-pencil" aria-hidden="true"></i></p><p><i class="fa fa-trash" aria-hidden="true"></i></p></div></li>');
  $('#group-list').append(newPersonItem);
}

//FOR MEAN CALCULATION
//GET PEOPLE FROM LIST**********************************************
function createMeanMarker() {

  var numPeople = 0;
  var totalLng = 0;
  var totalLat = 0;

  $('li.person').each(function() {
    numPeople++;
    lat += Number($(this).attr('data-lat'));
    lng += Number($(this).attr('data-lng'));
  });

  var meanLat = lat/numPeople;
  var meanLng = lng/numPeople;

  midMarker = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    draggable: true,
    position: {
      lat: meanLat,
      lng: meanLng
    },
    map: map
  });


}

//WHEN ADD PERSON***************************************************
$('#add-person-btn1').on('click', function(e) {

  // Prevent event default action
  e.preventDefault();

  // Get person info (name, address) from input fields
  var name = $('#name-input').val().trim();
  var address = $('#address-input').val().trim();
  var color = selectRandomColor();
  var lat;
  var lng;

  // Convert person address to coords to get lat and lng
  geocode(address).done(function(data) {
    lat = data.results[0].geometry.location.lat;
    lng = data.results[0].geometry.location.lng;
  });

  // Create person marker on map
  createPersonMarker(lat, lng);

  clearInputFields();

  // Add person to DOM list
  addPerson(name, address, lat, lng);

  // Get people from DOM list
  getList();

  // Initiate variables for mean calculation
  var totalLat = 0;
  var totalLng = 0;
  var numPeople = 0;

  // For every person on list, add to total
  group.forEach(function(person) {
    totalLat += Number(person.lat);
    totalLng += Number(person.lng);
    numPeople++;
  });

  // Calculate mean lat and lng
  var meanLat = totalLat / numPeople;
  var meanLng = totalLng / numPeople;

  // If more than one person on list, create mean marker
  if (numPeople > 1) {
    createMidMarker(meanLat, meanLng);
  }
});

//ON SEARCH BUSINESSES********************************************
$('#search-form').submit(function(e) {
  // Prevent event default action
  e.preventDefault();
  // Testing to see if submit event handler is working
  alert('working');
});

//DRAG MEAN MARKER*************************************************
google.maps.event.addListener(midMarker, 'dragend', function(marker) {
  var latLng = marker.latLng;
  currentLatitude = latLng.lat();
  currentLongitude = latLng.lng();
  console.log(currentLatitude, currentLongitude);
});