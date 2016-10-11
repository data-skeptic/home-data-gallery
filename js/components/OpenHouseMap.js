import React from "react"
import ReactDOM from "react-dom"
import { Map, MarkerGroup } from "react-d3-map"

import Markers from './Markers'

export default class OpenHouseMap extends React.Component {
  
  constructor(props) {
  	super(props)
  	this.state = {
  		lat: -100.95,
  		lng: 40.7,
  		zoom: 13
  	}
    this.popupContent = this.popupContent.bind(this)
    this.onMarkerMouseOut = this.onMarkerMouseOut.bind(this)
    this.onMarkerMouseOver = this.onMarkerMouseOver.bind(this)
    this.onMarkerClick = this.onMarkerClick.bind(this)
    this.onMarkerCloseClick = this.onMarkerCloseClick.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
  }

  updateDimensions() {
    console.log("Update viewport")
  }

  componentWillMount() {
    this.updateDimensions()
  }
  componentDidMount() {
    window.addEventListener("click", this.updateDimensions)
  }

  popupContent(d) { return d.properties.name; }

  onMarkerMouseOut(dom , d, i) {
    console.log('out')
  }
  onMarkerMouseOver(dom, d, i) {
    console.log('over')
  }
  onMarkerClick(dom, d, i) {
    console.log('clicks')
  }
  onMarkerCloseClick(id) {
    console.log('close click')
  }

  createMarker(lat, lng, props) {
    return {
      "type":"Feature",
      "properties":props,
      "geometry":{
        "type":"Point",
        "coordinates":[lng, lat]
      }
    }
  }

  render() {
    console.log("render map")
    var data = {"type":"FeatureCollection","features":[]}
    var listings = this.props.listings
    for (var i=0; i < listings.length; i++) {
      var listing = listings[i]
      var ao = listing['address_object']
      if (ao != undefined) {
        var lat = ao['latitude']
        var lng = ao['longitude']
        var raw = ao['raw_address']
        var props = {"title":raw}
        var marker = this.createMarker(lat, lng, props)
        data["features"].push(marker)
      }
    }

    var width = 400
    var height = 300
    var scale = 1 << 12
    var scaleExtent = [1 << 10, 1 << 14]
    const position = [this.state.lat, this.state.lng];
    return (
    <div>
      <Map
        width= {width}
        height= {height}
        scale= {scale}
        scaleExtent= {scaleExtent}
        center= {position}>
        <MarkerGroup
          key= {"polygon-test"}
          data= {data}
          popupContent= {this.popupContent}
          onClick= {this.onMarkerClick}
          onCloseClick= {this.onMarkerCloseClick}
          onMouseOver= {this.onMarkerMouseOver}
          onMouseOut= {this.onMarkerMouseOut}
          markerClass= {"map-marker"}
        />          
      </Map>
    </div>
    )
  }
}
