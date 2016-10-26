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
	    			<div id="rowOne">
	    				<div id="rowOneLeft">
	    					<OpenHouseMap listings={this.props.listings} setViewport={this.props.setViewport} />
	    				</div>
	    				<div id="rowOneRight">
	    					<Plots listings={this.props.listings} />
						</div>
	    			</div>
					<div class="clear"></div>
	    			<div>
		    			<DataTable listings={this.props.listings} />
	    			</div>
	           </div>
	    )
	}
}
