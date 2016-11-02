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
		var plotArea = (<div></div>)
		if (this.props.oneLoadComplete) {
			if (this.props.listings.length == 0) {
				plotArea = <PlotsNone />
			}
			else {
				plotArea = (
					<div class="col-md-6">
						<div id="rowOneRight">
							<Plots listings={this.props.listings} />
						</div>
					</div>
				)
			}
		}
		return (
    		<div id="tabs">
    			<div id="rowOne">
    				<div id="rowOneLeft">
    					<OpenHouseMap listings={this.props.listings} position={this.props.position} zoom={this.props.zoom} setPositionAndZoom={this.props.setPositionAndZoom} />
    				</div>
    				<div id="rowOneRight">
    					{plotArea}
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
