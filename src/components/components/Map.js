import React, { Component } from 'react'

class Map extends Component {
  constructor() {
    super();
    this.initMap = this.initMap.bind(this);
  }

  componentWillMount() {
    this.initMap();
  }

  initMap() {
    var uluru = {lat: -25.363, lng: 131.044};
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: uluru
    });
    var marker = new google.maps.Marker({
      position: uluru,
      map: map
    });
  }

  render() {
    return (
      <div id='map' className='absolute'>
        This is the Map.
      </div>
    );
  }

} 

export default Map