import React from "react";
import ReactDOM from "react-dom";

export default class Markers extends React.Component {
  constructor(props) {
  	super(props)
  }

  render() {
  	if (this.props.listing != undefined) {
  		var listing = this.props.listing
  		return (<div id="map-listing-detail">
  			<b>{listing.address_object.formatted_address}</b><br/>
  			<i>${listing.price}</i><br/>
  			<span class='map-listing-detail-title'>Beds</span>: {listing.bedrooms}
  			<span class='map-listing-detail-title'>Baths</span>: {listing.bathrooms}
  			<span class='map-listing-detail-title'>sq.ft.</span>: {listing.building_size}
  		</div>)
  	} else {
  		return (<div id="map-listing-detail"></div>)
  	}
  }
}
