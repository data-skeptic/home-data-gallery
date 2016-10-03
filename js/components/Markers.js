import React from "react";
import ReactDOM from "react-dom";

export default class Markers extends React.Component {

  render() {
	var markers = this.props.listings
	var markerComponents = markers.map(function(marker) {
		return <div className="marker">8</div>
	})
    return (<div>OH Map {markerComponents}</div>)
  }
}
