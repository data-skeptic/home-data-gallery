import React from "react";
import ReactDOM from "react-dom";

import OpenHouseMap from './OpenHouseMap'
import Plots from './Plots'
import PlotsNone from './PlotsNone'
import DataTable from './DataTable'

export default class DataView extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
		if (this.props.listings.length == 0) {
			return (
	    		<div id="tabs">
	    			<div id="rowOne">
	    				<div id="rowOneLeft">
	    					<OpenHouseMap listings={this.props.listings} position={this.props.position} zoom={this.props.zoom} setPositionAndZoom={this.props.setPositionAndZoom} />
	    				</div>
	    				<div id="rowOneRight">
	    					<PlotsNone  />
						</div>
	    			</div>
					<div class="clear"></div>
	    			<div>
		    			<DataTable listings={this.props.listings} />
	    			</div>
	           </div>
			)
		} else {
		    return (
	    		<div id="tabs">
	    			<div id="rowOne">
	    				<div id="rowOneLeft">
	    					<OpenHouseMap listings={this.props.listings} position={this.props.position} zoom={this.props.zoom} setPositionAndZoom={this.props.setPositionAndZoom} />
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
}
