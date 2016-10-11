import React from "react"
import ReactDOM from "react-dom"
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

import Markers from './Markers'

export default class OpenHouseMap extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      lat: 51.505,
      lng: -0.09,
      zoom: 13,
    };
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    return (
      <Map class='ohmap' center={position} zoom={this.state.zoom}>
       <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <Marker position={position}>
          <Popup>
            <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
          </Popup>
        </Marker>
      </Map>
    );
  }
}