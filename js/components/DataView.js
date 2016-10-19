import React from "react";
import ReactDOM from "react-dom";

import OpenHouseMap from './OpenHouseMap'
import Plots from './Plots'
import DataTable from './DataTable'

export default class DataView extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
	    return (<div id="tabs">
	    			<OpenHouseMap listings={this.props.listings} setViewport={this.props.setViewport} />
	    			<Plots listings={this.props.listings} />
	    			<DataTable listings={this.props.listings} />
	           </div>)
	}
}
