import React from "react"
import ReactDOM from "react-dom"
import Rcslider from "rc-slider"

export default class Slider extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			min_value: 0,
			max_value: 10,
			low: 1,
			high: 9,
			include_any: true,
			include_all: true
		}
	}

	onPartialUpdate(event) {
		var input = event.target
		this.setState({'low': event[0], 'high': event[1]})
	}

	onUpdate(event) {
		// update search
		console.log("full")
	}

	render() {
		var min_value = this.state.min_value
		var max_value = this.state.max_value
		var low = this.state.low
		var high = this.state.high
		var defVal = [low, high]
		var low_label  = low.toString()
		var high_label = high.toString()
    	return (<div class='slider'>
				  <Rcslider
				   min={this.state.min_value}
				   max={this.state.max_value}
				   allowCross={false}
				   range={true}
				   defaultValue={defVal}
				   onChange={this.onPartialUpdate.bind(this)}
				   onAfterChange={this.onUpdate.bind(this)}
				  />
      		<center><span class='slider_label'>{this.props.title}: {low_label} to {high_label}</span></center>
           </div>)
	}
}
