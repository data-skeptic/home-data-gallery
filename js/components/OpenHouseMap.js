import React from "react"
import ReactDOM from "react-dom"
import { Map, MarkerGroup } from "react-d3-map"
import { ZoomControl, projection } from "react-d3-map-core"

import Marker from './Marker'

const iscale = (1 << 11)
const iposition = [-100.95, 40.7]

export default class OpenHouseMap extends React.Component {
  
  constructor(props) {
  	super(props)
  	this.state = {
      position: iposition,
      scale: iscale,
      selected: undefined,
      viewport: undefined
  	}
    this.zoomIn = this.zoomIn.bind(this)
    this.zoomOut = this.zoomOut.bind(this)
    this.popupContent = this.popupContent.bind(this)
    this.onMarkerMouseOut = this.onMarkerMouseOut.bind(this)
    this.onMarkerMouseOver = this.onMarkerMouseOver.bind(this)
    this.onMarkerClick = this.onMarkerClick.bind(this)
    this.onMarkerCloseClick = this.onMarkerCloseClick.bind(this)
    this.componentDidMount = this.componentDidMount.bind(this)
    this.updateDimensions = this.updateDimensions.bind(this)
  }

  updateDimensions() {
    var mmap = this.state.mmap
    if (mmap != undefined) {
      var w = mmap.props.width
      var h = mmap.props.height
      var zt = mmap.state.zoomTranslate
      var c = mmap.projection.invert([zt[1], zt[0]])
      var ul = mmap.projection.invert([zt[1] - w/2, zt[0] - h/2])
      var lr = mmap.projection.invert([zt[1] + w/2, zt[0] + h/2])
      var viewport = {"top": ul[1], "bottom": lr[1], "left": ul[0], "right": lr[0]}
      this.setState({position: c, viewport: viewport})
      mmap.setState({center: c})
    }
  }
  componentDidMount() {
    window.addEventListener("click", this.updateDimensions)
  }

  zoomOut() {
    this.setState({scale: this.state.scale / 2})
  }

  zoomIn() {
    this.setState({scale: this.state.scale * 2})
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
    var position = iposition
    var scale = iscale
    var zoomIn = this.zoomIn
    var zoomOut = this.zoomOut
    return (
      <div>
        <Map
          width= {width}
          height= {height}
          scale= {scale}
          zoomScale= {this.state.scale}
          center= {position}
          scaleExtent= {scaleExtent}
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
          zoomInClick= {zoomIn}
          zoomOutClick= {zoomOut}
        />      
        </Map>
        <Marker listing={this.state.selected}>
        </Marker>
      </div>
    )
  }
}
