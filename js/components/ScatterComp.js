import React from "react"
import ReactDOM from "react-dom"
import rd3 from 'react-d3'

import ResponsiveComponent from './ResponsiveComponent'

export default class ScatterComp extends ResponsiveComponent {

    constructor(props) {
        super(props)
    }

    render() {
    var ScatterChart = rd3.ScatterChart;

    let {parentWidth} = this.state;
    let width = parentWidth - 120;

    return (<div class='plots'>
                <ScatterChart
                width={width}
                height={225}
                data={this.props.data}
                title={this.props.title}
                xAxisLabel={this.props.xAxisLabel}
                yAxisLabel={this.props.yAxisLabel}
                domain={this.props.domain}
                />
            </div>)
    }
}
