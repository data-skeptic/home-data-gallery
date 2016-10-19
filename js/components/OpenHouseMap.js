import React from "react"
import ReactDOM from "react-dom"
import { Map, MarkerGroup } from "react-d3-map"
import { ZoomControl, projection } from "react-d3-map-core"

import Marker from './Marker'

export default class OpenHouseMap extends React.Component {
  
  constructor(props) {
  	super(props)
  	this.state = {
  		lat: -100.95,     // TODO: revisit if these should store here or in mmap
  		lng: 40.7,
  		scale: (1 << 12),
      selected: undefined
  	}
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
    var mmap = this.state.mmap
    if (mmap != undefined) {
      var zt = mmap.state.zoomTranslate
      console.log([zt[0], zt[1], mmap.state.scaleSet])
      // projection
      var nscale = this.state.mmap.state.scaleSet
      var me = this
      var fn = this.state.mmap.projection.invert
      var nll = fn(zt)
      console.log(nll)
      setTimeout(function() {
        console.log("compare to")
        var fn = me.state.mmap.projection.invert
        var nll = fn(zt)
        console.log(zt)
        console.log(nll)
      }, 500);
      //this.setState({"lat": nll[0], "lng": nll[1], "scale": nscale})
    }
  }

  componentWillMount() {
    this.updateDimensions()
  }
  componentDidMount() {
    window.addEventListener("click", this.updateDimensions)
  }

  onZoom(onZoomScale, onZoomTranslate) {
    console.log("hi2zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz")
    this.setState({
      scaleSet: onZoomScale,
      zoomTranslate: onZoomTranslate
    })
  }

  zoomOut() {
    console.log('zo')
    var newScale = this.state.scale / 2
    this.setState({scale: newScale})
    this.state.mmap.setState({'scaleSet': newScale})
  }

  zoomIn() {
    console.log('zi')
    var newScale = this.state.scale * 2
    this.setState({scale: newScale})
    this.state.mmap.setState({'scaleSet': newScale})
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
    console.log("render")
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
    var mmap = this.state.mmap
    var p = [this.state.lat, this.state.lng]
    const position = p
    var onZoom = this.onZoom.bind(this);
    return (
      <div>
        <Map
          width= {width}
          height= {height}
          scale= {this.state.scale}
          scaleExtent= {scaleExtent}
          center= {position}
          onZoom= {onZoom}
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
