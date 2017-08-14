 // var center = {lat: -25.363, lng: 131.044};



// function initMap() {
  
//   console.log("initmap");
  

//   var map = new google.maps.Map(document.getElementById('map'), {
//     zoom: 4,
//     center: center
//   });

//   var marker = new google.maps.Marker({
//     draggable: true,
//     animation: google.maps.Animation.DROP,
//     position: center,
//     map: map
//   });

//   google.maps.event.addListener(marker, 'dragend', function(marker){
//     var latLng = marker.latLng; 
//     currentLatitude = latLng.lat();
//     currentLongitude = latLng.lng();
//     console.log(currentLatitude, currentLongitude);
//  }); 
// }

var center = {lat: 33.902589225, lng: -84.369156975};

 // var center = {lat: -25.363, lng: 131.044};
function initMap(center) {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 11,
    center: center
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

initMap(center);


$("#submit-btn").on("click", function(e) {
    e.preventDefault();

    center.lat = Number(document.getElementById("lat").value);
    center.lng = Number(document.getElementById("lng").value);

    initMap(center);

  });




$("#group-btn").on("click", function() {

});

$("#add-member-btn").on("click", function() {

});