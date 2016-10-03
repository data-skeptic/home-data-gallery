import React from "react"
import ReactDOM from "react-dom"
import {Map, Marker, Popup, TileLayer} from "react-leaflet";

//var Map = require('react-d3-map').Map;
//var MarkerGroup = require('react-d3-map').MarkerGroup;

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
    const position = [this.state.lat, this.state.lng];
    return (<Map id="map-container" center={position} zoom={this.state.zoom}>
      <TileLayer
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>
          <span>A pretty CSS3 popup.<br/>Easily customizable.</span>
        </Popup>
      </Marker>
    </Map>)
    /*
    const center = [this.state.lat, this.state.lng];
    var width = 700;
    var height = 700;
    var scale = 1200 * 5;
    var scaleExtent = [1 << 12, 1 << 13]

    var popupContent = function(d) { console.log(1); return d.properties.text; }

    var data = {"type": "FeatureCollection","features": []}
    var listings = this.props.listings
    for (var i=0; i < listings.length; i++) {
      var listing = listings[i]
      if (listing['address_object'] !== undefined) {
        var lat = listing['address_object']['latitude']
        var lon = listing['address_object']['longitude']
        var nlisting = {
                    "type": "Feature",
                    "properties": {
                      "text": listing['raw_address']
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [lat, lon]
                    }
                  }
        data['features'].push(nlisting)
      }
    }
    return (
        <Map
          width= {width}
          height= {height}
          scale= {scale}
          scaleExtent= {scaleExtent}
          center= {center}
        >
          <MarkerGroup
            key= {"polygon-test"}
            data= {data}
            popupContent= {popupContent}
            markerClass= {"your-marker-css-class"}
          />
        </Map>
    );
    */
  }
}
