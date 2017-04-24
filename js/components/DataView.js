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
                    <div id="mapAndPlotRow" className="row">
                        <div className="col-lg-6">
                            <OpenHouseMap listings={this.props.listings} position={this.props.position} zoom={this.props.zoom} setPositionAndZoom={this.props.setPositionAndZoom} />
                        </div>

                        <div className="col-lg-6">
                            {plotArea}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <DataTable listings={this.props.listings} />
                        </div>
                    </div>
                </div>
        )
    }
}
