import React from "react";
import ReactDOM from "react-dom";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

export default class OpenHouseMap extends React.Component {
  constructor() {
    super()
    this.handleMoveend = this.handleMoveend.bind(this)
    this.themap = undefined
  }

  componentDidMount() {
    var map = this.themap.leafletElement
    var c = map.getCenter()
    var z = map.getZoom()
    var b = map.getBounds()
    var p = {latitude: c.lat, longitude: c.lng}
    this.props.setPositionAndZoom(p, z, b)
  }

  handleMoveend(e) {
    var map = e.target
    var c = map.getCenter()
    var z = map.getZoom()
    var b = map.getBounds()
    var p = {latitude: c.lat, longitude: c.lng}
    this.props.setPositionAndZoom(p, z, b)
  }

  render() {
    var listings = this.props.listings
    const position = [this.props.position.latitude, this.props.position.longitude]
    return (
      <Map
        ref={(map) => { this.themap = map; }}
        class="the-map"
        onMoveend={this.handleMoveend}
        center={position}
        zoom={this.props.zoom}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          {listings.map(function(listing) {
            var ao = listing.address_object
            if (ao != undefined) {
              var p = [ao.latitude, ao.longitude]
              return (
                <Marker key={listing.id} position={p}>
                  <Popup>
                    <span><strong>{listing.address_object.formatted_address}</strong><br/>
                          <strong>Price:</strong> {listing.price}<br/>
                          <strong>Sq.ft:</strong> {listing.building_size}<br/>
                          <strong>Timestamp: </strong>{listing.listing_timestamp.substring(0, 10)}
                    </span>
                  </Popup>
                </Marker>
              )              
            }
          })}
      </Map>
    )
  }
}
