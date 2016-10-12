import React from "react"
import ReactDOM from "react-dom"
import { Map, MarkerGroup } from "react-d3-map"
import { ZoomControl } from "react-d3-map-core"

import Marker from './Marker'

export default class OpenHouseMap extends React.Component {
  
  constructor(props) {
  	super(props)
  	this.state = {
  		lat: -100.95,
  		lng: 40.7,
  		scale: (1 << 12),
      selected: undefined
  	}
    this.onChange = this.onChange.bind(this)
    this.zoomIn = this.zoomIn.bind(this)
    this.zoomOut = this.zoomOut.bind(this)
    this.popupContent = this.popupContent.bind(this)
    this.onMarkerMouseOut = this.onMarkerMouseOut.bind(this)
    this.onMarkerMouseOver = this.onMarkerMouseOver.bind(this)
    this.onMarkerClick = this.onMarkerClick.bind(this)
    this.onMarkerCloseClick = this.onMarkerCloseClick.bind(this)
    this.componentWillMount = this.componentWillMount.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.updateDimensions = this.updateDimensions.bind(this)
  }

  updateDimensions() {
    console.log("Update viewport")
    console.log([this.state.lat, this.state.lng, this.state.scale])
    var mmap = this.state.mmap
    if (mmap != undefined) {
      console.log("mmap")
      console.log(mmap)
      var nscale = this.state.mmap.state.scaleSet
      console.log(this.state.mmap.state.zoomTranslate)
      this.setState({scale: nscale})
    }
  }

  componentWillMount() {
    this.updateDimensions()
  }
  componentDidMount() {
    window.addEventListener("click", this.updateDimensions)
  }

  onChange() {
    console.log("hi")
  }

  zoomOut() {
    console.log("zo")
    this.setState({
      scale: this.state.scale / 2
    })
  }

  zoomIn() {
    console.log("zi")
    this.setState({
      scale: this.state.scale * 2
    })
  }

  popupContent(d) { return d.properties.name; }

  onMarkerMouseOut(dom , d, i) {
    console.log('out')
  }
  onMarkerMouseOver(dom, d, i) {
    console.log('over')
  }
  onMarkerClick(dom, d, i) {
    this.setState( {selected: d["properties"]["listing"]} )
  }
  onMarkerCloseClick(id) {
    console.log('close click')
  }

  createMarker(lat, lng, lprops) {
    return {
      "type":"Feature",
      "properties":lprops,
      "geometry":{
        "type":"Point",
        "coordinates":[lng, lat]
      }
    }
  }

  render() {
    var data = {"type":"FeatureCollection","features":[]}
    var listings = this.props.listings
    for (var i=0; i < listings.length; i++) {
      var listing = listings[i]
      var ao = listing['address_object']
      if (ao != undefined) {
        var lat = ao['latitude']
        var lng = ao['longitude']
        var raw = ao['raw_address']
        var lprops = {"listing":listing}
        var marker = this.createMarker(lat, lng, lprops)
        data["features"].push(marker)
      }
    }

    var width = 400
    var height = 300
    var scaleExtent = [1 << 10, 1 << 14]
    const position = [this.state.lat, this.state.lng];
    console.log("scale:")
    console.log(this.state.scale)
    return (
      <div>
        <Map
          width= {width}
          height= {height}
          scale= {this.state.scale}
          scaleExtent= {scaleExtent}
          center= {position}
          ref={(ref) => this.state.mmap = ref} >
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
        <ZoomControl
          zoomInClick= {this.zoomIn}
          zoomOutClick= {this.zoomOut}
        />      
        </Map>
        <Marker listing={this.state.selected}>
        </Marker>
      </div>
    )
  }
}
