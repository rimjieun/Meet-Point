//VARIABLES******************************************************
var map;
var midMarker;
var markerColors = ['red', 'yellow', 'green', 'blue', 'purple'];
var tempColors = [];
var queryData = {};

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



//CLEAR INPUT FIELDS**********************************************
function clearInputFields() {
  // Empty input fields
  $('#name-input').val('');
  $('#address-input').val('');
}

//CREATE PERSON MARKER********************************************
function createPersonMarker(lat, lng, color) {

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
function addPerson(name, address, lat, lng, color) {
  var newPersonItem = $('<li class="person" data-name="' + name + '" data-address="' + address + '" data-lat="' + lat + '" data-lng="' + lng + '"><div class="person-icon left"><img src="assets/img/' + color + '-marker.png" class="person-icon"></div><div class="person-info left"><p class="person-name">' + name + '</p><p class="person-address">' + address + '</p></div><div class="person-options"><p><i class="fa fa-pencil" aria-hidden="true"></i></p><p><i class="fa fa-trash" aria-hidden="true"></i></p></div></li>');
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
    totalLat += Number($(this).attr('data-lat'));
    totalLng += Number($(this).attr('data-lng'));
  });

  var meanLat = totalLat / numPeople;
  var meanLng = totalLng / numPeople;

  if (numPeople > 1) {

    var icon = {
      url: 'assets/img/mean-marker.png', // url
      scaledSize: new google.maps.Size(50, 50), // scaled size
      origin: new google.maps.Point(0, 0), // origin
      anchor: new google.maps.Point(25, 50) // anchor
    };

    midMarker = new google.maps.Marker({
      icon: icon,
      animation: google.maps.Animation.DROP,
      draggable: true,
      crossOnDrag: false,
      position: {
        lat: meanLat,
        lng: meanLng
      },
      map: map
    });

    updateQueryCoords(meanLat, meanLng);

    midMarker.addListener('dragend', function(marker) {
      newLat = marker.latLng.lat();
      newLng = marker.latLng.lng();
      updateQueryCoords(newLat, newLng);
      updateUrlParams(queryData);
    });
  }
}

function updateQueryCoords(lat, lng) {
  queryData.lat = lat;
  queryData.lng = lng;
}

function updateQueryTerm(term) {
  queryData.search = term;
}

function updateUrlParams(data) {
  var queryArray = [];
  for (var d in data) {
    queryArray.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }
  var queryString = "?" + queryArray.join('&');
  history.pushState({}, '', queryString);
}

function searchLocations() {
  var paramsArray = [];
  var paramsString = window.location.search;
  var ret = paramsString.slice(1, paramsString.length).split('&');

  ret.forEach(function(data) {
    var param = [
      data.split('=')[0],
      data.split('=')[1]
    ];
    paramsArray.push(param);
  });

  var paramsObject = new Map(paramsArray);

  var querySearch = paramsObject.get('search');
  var queryLat = paramsObject.get('lat');
  var queryLng = paramsObject.get('lng');

  console.log('params: ' + querySearch + ', ' + queryLat + ', ' + queryLng);

  $.ajax({
    url: 'https://api.yelp.com/v3/businesses/search?term=cafe&latitude=33.893793147220464&longitude=-84.15886765214833',
    headers: { 'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN},
    method: 'POST'
  }).then(function(data) {
    console.log("yelp data: " + data);
  }).catch(function(err) {
    console.log(err);
  });

}

function yelpAPIRequest(search, lat, lng) {
  $.ajax({
    url: 
  })
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

  clearInputFields();

  // Convert person address to coords to get lat and lng
  geocode(address).done(function(data) {
    lat = data.results[0].geometry.location.lat;
    lng = data.results[0].geometry.location.lng;
  });

  // Add person to DOM list
  addPerson(name, address, lat, lng, color);

  // Create person marker on map
  createPersonMarker(lat, lng, color);

  createMeanMarker();

});

//ON SEARCH BUSINESSES********************************************
$('#search-form').submit(function(e) {
  // Prevent event default action
  e.preventDefault();

  var term = $('#search').val().trim();

  updateQueryTerm(term);

  // Testing to see if submit event handler is working
  updateUrlParams(queryData);
  searchLocations();
});