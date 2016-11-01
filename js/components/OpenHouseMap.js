import React from "react";
import ReactDOM from "react-dom";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

export default class OpenHouseMap extends React.Component {
  constructor() {
    super()
    this.handleMoveend = this.handleMoveend.bind(this)
  }

  handleMoveend(e) {
    console.log("========")
    var map = e.target
    var c = map.getCenter()
    var z = map.getZoom()
    var p = {latitude: c.lat, longitude: c.lng}
    this.props.setPositionAndZoom(p, z)
  }

  render() {
    console.log("render map")
    var listings = this.props.listings
    const position = [this.props.position.latitude, this.props.position.longitude]
    return (
      <Map 
        class="the-map"
        onMoveend={this.handleMoveend}
        center={position}
        zoom={this.props.zoom}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          {listings.map(function(listing) {
              var p = [listing.latitude, listing.longitude]
              return (
                <Marker position={p}>
                  <Popup>
                    <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
                  </Popup>
                </Marker>
              )
          })}
      </Map>
    );
  }
}
