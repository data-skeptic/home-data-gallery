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
							<Plots listings={this.props.listings} />
				)
			}
		}
		return (
				<div class="container">
					<div id="mapAndPlotRow" class="row clearfix">
						<div class="col-md-5 float-xs-left">
							<OpenHouseMap listings={this.props.listings} position={this.props.position} zoom={this.props.zoom} setPositionAndZoom={this.props.setPositionAndZoom} />    				
						</div>		

						<div class="col-md-5 float-xs-right">
							{plotArea}
						</div>
					</div>
					<div class="row">
						<DataTable listings={this.props.listings} />
					</div>
				</div>
		)
	}
}
