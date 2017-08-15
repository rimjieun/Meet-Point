(function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(storePosition);
  } else { 
      console.log('Geolocation is not supported by this browser.');
  }
})();

function initMap(center) {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: center,
    mapTypeControlOptions: {
      mapTypeIds: []
    }
  });

  var marker = new google.maps.Marker({
    draggable: true,
    animation: google.maps.Animation.DROP,
    position: center,
    map: map
  });

  google.maps.event.addListener(marker, 'dragend', function(marker){
    var latLng = marker.latLng; 
    currentLatitude = latLng.lat();
    currentLongitude = latLng.lng();
    console.log(currentLatitude, currentLongitude);
  }); 
}

function storePosition(position) {
  var center = {
    lat: Number(position.coords.latitude),
    lng: Number(position.coords.longitude)
  };
  initMap(center);
}

var autocomplete = new google.maps.places.Autocomplete(document.getElementById('address-input'));

function Person(name, add, noti, method, cont) {
  this.name = name;
  this.address = add;
  this.wantNotification = noti;
  this.notificationMethod = method;
  this.contactInfo = cont;
}

function addPerson(name, address) {
  var newPersonItem = $('<li class="person" data-name="' + name + '" data-address="' + address + '"><div class="person-icon left"><i class="fa fa-user" aria-hidden="true"></i></div><div class="person-info left">' + name + '<p class="person-address">' + address + '</p></div><div class="person-options"><p><i class="fa fa-pencil" aria-hidden="true"></i></p><p><i class="fa fa-trash" aria-hidden="true"></i></p></div></li>');
  $('#group-list').append(newPersonItem);
}

$('.modal').modal();

$('#group-modal-btn').on('click', function() {
  $('#group-info').modal('open');
});

$('#person-modal-btn').on('click', function() {
  $('#new-member-form').modal('open');
});

$('#add-person-btn').on('click', function(e) {
  e.preventDefault();

  var name = $('#name-input').val().trim();
  var address = $('#address-input').val().trim();

  addPerson(name, address);
});