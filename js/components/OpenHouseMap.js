import React from "react";
import ReactDOM from "react-dom";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

export default class OpenHouseMap extends React.Component {
  constructor() {
    super()
    this.state = {
      mmap: undefined
    }
  }

  render() {
    console.log("render map")
    //listings={this.props.listings} 
    //setPositionScale={this.props.setPositionScale} 
    var listings = this.props.listings
    const position = [this.props.position.latitude, this.props.position.longitude]
    return (
      <Map class="the-map" center={position} zoom={this.props.zoom} ref={(ref) => this.state.mmap = ref}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        {listings.map(function(listing) {
            console.log(listing)
            var p = [listing.position.latitude, listing.position.longitude]
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
