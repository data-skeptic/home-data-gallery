import React from "react"
import ReactDOM from "react-dom"
import rd3 from 'react-d3'

export default class ScatterComp extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
	var ScatterChart = rd3.ScatterChart;
	return (<div>
				<ScatterChart
				data={this.props.data}
				title={this.props.title}
				xAxisLabel={this.props.xAxisLabel}
				yAxisLabel={this.props.yAxisLabel}
				domain={this.props.domain}
				/>
	       </div>)
	}
}
