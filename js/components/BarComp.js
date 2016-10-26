import React from "react"
import ReactDOM from "react-dom"
import rd3 from 'react-d3'

export default class BarComp extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
	var BarChart = rd3.BarChart;
	return (<div>
		      <BarChart
			      data={this.props.data}
			      title={this.props.title}
			      xAxisLabel={this.props.xAxisLabel}
			      yAxisLabel={this.props.yAxisLabel}
			      />
	       </div>)
	}
}
