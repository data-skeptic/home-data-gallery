import React from "react"
import ReactDOM from "react-dom"
import rd3 from 'react-d3'

import ResponsiveComponent from './ResponsiveComponent'

export default class BarComp extends ResponsiveComponent {

    constructor(props) {
        super(props)
    }

    render() {
        var BarChart = rd3.BarChart;

        let {parentWidth} = this.state;
        let width = parentWidth - 120;

        return (<div class='plots'>
                <BarChart
                    width={width}
                    height={225}
                    data={this.props.data}
                    title={this.props.title}
                    xAxisLabel={this.props.xAxisLabel}
                    yAxisLabel={this.props.yAxisLabel}
                    />
            </div>)
    }
}
