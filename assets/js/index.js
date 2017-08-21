// if (location.protocol != 'https:')
// {
//  location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
// }

var map;
var midMarker;

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

function createPersonMarker(lat, lng) {
  var personMarker = new google.maps.Marker({
    icon: 'assets/img/red-marker.png',
    // animation: google.maps.Animation.DROP,
    position: {
      lat: lat,
      lng: lng},
    map: map
  });
}

function createMidMarker(lat, lng) {
  midMarker = new google.maps.Marker({
    animation: google.maps.Animation.DROP,
    draggable: true,
    position: {
      lat: lat,
      lng: lng},
    map: map
  });
}

// function storePosition(position) {
//   var center = {
//     lat: Number(position.coords.latitude),
//     lng: Number(position.coords.longitude)
//   };
//   initMap(center);
// }

var autocomplete = new google.maps.places.Autocomplete(document.getElementById('address-input'));

$('.modal').modal();

$('#group-modal-btn').on('click', function() {
  $('#group-info').modal('open');
});

$('#person-modal-btn').on('click', function() {
  $('#new-member-form').modal('open');
});

var group;

function Person(name, add, lat, lng, noti, method, cont) {
  this.name = name;
  this.address = add;
  this.lat = lat;
  this.lng = lng;
  this.notificationMethod = method;
  this.contactInfo = cont;
}

function returnValue(value) {
  return value;
}

function geocode(address) {

  var geocodeURL = 'https://maps.googleapis.com/maps/api/geocode/json';
  var geocodeKey = 'AIzaSyBXVMfGC-uz0W8eYzwy85Kv91y6B1902ig';

  geocodeURL += '?' + $.param({
      'api_key': geocodeKey,
      'address': address
  });

  var data = $.ajax({
    url: geocodeURL,
    method: 'GET',
    async: false
  });

  return data;

}

function addPerson(name, address, lat, lng) {
  var newPersonItem = $('<li class="person" data-name="' + name + '" data-address="' + address + '" data-lat="' + lat + '" data-lng="' + lng + '"><div class="person-icon left"><i class="fa fa-user" aria-hidden="true"></i></div><div class="person-info left"><p class="person-name">' + name + '</p><p class="person-address">' + address + '</p></div><div class="person-options"><p><i class="fa fa-pencil" aria-hidden="true"></i></p><p><i class="fa fa-trash" aria-hidden="true"></i></p></div></li>');
  $('#group-list').append(newPersonItem);
}

function getList() {
  group = [];
  $('li.person').each(function() {
    var name = $(this).attr('data-name');
    var add = $(this).attr('data-address');
    var lat = $(this).attr('data-lat');
    var lng = $(this).attr('data-lng');
    var noti = null;
    var method = null;
    var cont = null;

    var newPerson = new Person(name, add, lat, lng, noti, method, cont);
    group.push(newPerson);
  });
}

$('#add-person-btn1').on('click', function(e) {
  e.preventDefault();

  var name = $('#name-input').val().trim();
  var address = $('#address-input').val().trim();
  var lat;
  var lng;

  geocode(address).done(function(data) {
    lat = data.results[0].geometry.location.lat;
    lng = data.results[0].geometry.location.lng;
  });

  createPersonMarker(lat, lng);

  $('#name-input').val('');
  $('#address-input').val('');
  
  addPerson(name, address, lat, lng);

  getList();

  var totalLat = 0;
  var totalLng = 0;
  var numPeople = 0;

  group.forEach(function(person) {
    totalLat += Number(person.lat);
    totalLng += Number(person.lng);
    numPeople++;
  });

  var meanLat = totalLat/numPeople;
  var meanLng = totalLng/numPeople;

  createMidMarker(meanLat, meanLng);

});

google.maps.event.addListener(midMarker, 'dragend', function(marker){
  var latLng = marker.latLng; 
  currentLatitude = latLng.lat();
  currentLongitude = latLng.lng();
  console.log(currentLatitude, currentLongitude);
});