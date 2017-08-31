$(document).ready(function() {
  // init.reroute();
  init.map();
  init.autocomplete();
  init.modal();
  init.sideNav();

  //WHEN ADD PERSON***************************************************
  $('#add-person-btn1').on('click', function(e) {
    e.preventDefault();
    addPerson();
    clearInputFields();
  });

  //ON SEARCH BUSINESSES********************************************
  $('#search-form').submit(function(e) {
    // Prevent event default action
    e.preventDefault();
    var term = $('#search').val().trim();
    $('.button-collapse').trigger('click');
    updateQueryTerm(term);
    updateUrlParams(queryData);
  });

});

//VARIABLES******************************************************
var map;
var midMarker;
var markerColors = ['red', 'yellow', 'green', 'blue', 'purple'];
var tempColors = [];
var queryData = {};
var person = {
  name: '',
  address: '',
  color: '',
  lat: '',
  lng: '',
  notificationMethod: '',
  contactInfo: ''
};


var init = {
  reroute: function() {
    if (location.protocol != 'https:') {
      location.href = 'https:' + window.location.href.substring(window.location.protocol.length);
    }
  },
  map: function() {
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
  },
  autocomplete: function() {
    //ADDRESS FIELD AUTOCOMPLETE*************************************
    var autocomplete = new google.maps.places.Autocomplete(document.getElementById('address-input'));
  },
  modal: function() {
    //MODALS*********************************************************
    $('.modal').modal();

    $('#group-modal-btn').on('click', function() {
      $('#group-info').modal('open');
    });

    $('#person-modal-btn').on('click', function() {
      $('#new-member-form').modal('open');
    });
  },
  sideNav: function() {
    $('.button-collapse').sideNav();
  }
}



//CLEAR INPUT FIELDS**********************************************
function clearInputFields() {
  // Empty input fields
  $('#name-input').val('');
  $('#address-input').val('');
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

function updateQueryCoords(lat, lng) {
  queryData.lat = lat;
  queryData.lng = lng;
}

function updateQueryTerm(term) {
  queryData.term = term;
}

function updateUrlParams(data) {
  var queryArray = [];
  for (var d in data) {
    queryArray.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
  }
  var queryString = "?" + queryArray.join('&');
  history.pushState({}, '', queryString);
  getSearchResults();
}

function addPerson() {
  person.name = $('#name-input').val().trim();
  person.address = $('#address-input').val().trim();
  person.color = selectRandomColor();

  var data = {
    address: person.address
  };

  $.get('/geocode', data).done(function(res) {
    person.lat = res.results[0].geometry.location.lat;
    person.lng = res.results[0].geometry.location.lng;
    $('#group-list').append('<li class="person" data-name="' + person.name + '" data-address="' + person.address + '" data-lat="' + person.lat + '" data-lng="' + person.lng + '"><div class="person-icon left"><img src="assets/img/' + person.color + '-marker.png" class="person-icon"></div><div class="person-info left"><p class="person-name">' + person.name + '</p><p class="person-address">' + person.address + '</p></div><div class="person-options"><p><i class="fa fa-pencil" aria-hidden="true"></i></p><p><i class="fa fa-trash" aria-hidden="true"></i></p></div></li>');
    createPersonMarker(person.lat, person.lng, person.color);
    if ($('li.person').length > 1) {
      createMeanMarker();
    }
  });
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
    getSearchResults();
  });
}

function getSearchResults() {
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

  var queryTerm = paramsObject.get('term');
  var queryLat = paramsObject.get('lat');
  var queryLng = paramsObject.get('lng');

  var data = {
    term: queryTerm,
    lat: queryLat,
    lng: queryLng
  };

  $.get('/search', data).done(function(res) {

    $('#slide-out').empty();

    res.businesses.forEach(function(place) {
      var id = place.id;
      var name = place.name;
      var img = place.image_url;
      var url = place.url;
      var cat = function() {
        var catArr = place.categories.map(function(el) {
          return el.title
        });
        return catArr.join(', ');
      }
      var rate = place.rating;
      var lat = place.coordinates.latitude;
      var lng = place.coordinates.longitude;
      var price = place.price;
      var add = place.location.display_address.join(', ');
      var phone = place.display_phone;
      console.log('yelp api: ' + id, name, img, url, cat, rate, lat, lng, price, add, phone);
      createResultItem(id, name, img, url, cat, rate, lat, lng, price, add, phone);
    });
  });
}

function createResultItem(id, name, img, url, cat, rate, lat, lng, price, add, phone) {
  var resultItem = $('<li>')
    .attr('data-yelp-id', id)
    .attr('data-yelp-name', name)
    .attr('data-yelp-img', img)
    .attr('data-yelp-url', url)
    .attr('data-yelp-categories', cat)
    .attr('data-yelp-rating', rate)
    .attr('data-lat', lat)
    .attr('data-lng', lng)
    .attr('data-yelp-price', price)
    .attr('data-address', add)
    .attr('data-phone-number', phone);

  var placeName = $('<p class="place-name">').text(name);
  var placeCategories = $('<p class="place-categories">').text(cat);
  var placeRating = $('<p class="place-rating">').text(rate);
  var placePrice = $('<p class="place-price">').text(price);

  resultItem.append(placeName).append(placeCategories).append(placeRating).append(placePrice);

  $('#slide-out').append(resultItem);
}