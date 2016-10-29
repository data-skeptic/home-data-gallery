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
	    return (
	    		<div id="tabs">
	    			<div class="row">
	    				<div class="col-md-6">
	    					<OpenHouseMap listings={this.props.listings} setViewport={this.props.setViewport} />
	    				</div>
	    				<div class="col-md-6">
	    					<Plots listings={this.props.listings} />
						</div>
	    			</div>
	    			<div class="row">
						<div class="col-sm-12">
		    				<DataTable listings={this.props.listings} />
						</div>
	    			</div>
	           </div>
	    )
	}
}
