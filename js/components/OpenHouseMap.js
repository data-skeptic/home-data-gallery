import React from "react"
import ReactDOM from "react-dom"
import { Map, MarkerGroup } from "react-d3-map"

import Markers from './Markers'

export default class OpenHouseMap extends React.Component {
  
  constructor(props) {
  	super(props)
  	this.state = {
  		lat: 51.505,
  		lng: -0.09,
  		zoom: 13
  	}
  }

  render() {
    var listings = this.props.listings
    var width = 400
    var height = 300
    var scale = 1 << 12
    var scaleExtent = [1 << 10, 1 << 14]
    var center = [-100.95, 40.7]
    const position = [this.state.lat, this.state.lng];
    return (
      <div>
        <Map
          width= {width}
          height= {height}
          scale= {scale}
          scaleExtent= {scaleExtent}
          center= {center}>
        </Map>
      </div>
      )

  }
}
