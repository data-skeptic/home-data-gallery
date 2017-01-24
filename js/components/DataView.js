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
				<div className="container">
					<div id="mapAndPlotRow" className="row clearfix">
						<div className="col-md-5 float-xs-left">
							<OpenHouseMap listings={this.props.listings} position={this.props.position} zoom={this.props.zoom} setPositionAndZoom={this.props.setPositionAndZoom} />    				
						</div>		

						<div className="col-md-5 float-xs-right">
							{plotArea}
						</div>
					</div>
					<div className="row">
						<DataTable listings={this.props.listings} />
					</div>
				</div>
		)
	}
}
