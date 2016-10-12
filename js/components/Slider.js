import React from "react"
import ReactDOM from "react-dom"
import Rcslider from "rc-slider"

export default class Slider extends React.Component {

	constructor(props) {
		super(props)
		this.state = {
			onUpdate: this.props.onUpdate,
			min_value: this.props.min_value,
			max_value: this.props.max_value,
			low: this.props.low,
			high: this.props.high,
			include_any: true,
			include_all: true
		}
	}

	/**
		This function only updates this component's labels.
		It is called only when the user is still moving the
		value of the component.  This generates a lot of
		updates, and we don't want to call the API until
		the user has made up their mind.
	*/
	onPartialUpdate(event) {
		var input = event.target
		this.setState({'low': event[0], 'high': event[1]})
	}

	/*
		This function is called only once the user let's go
		of the slider, indicating they've finalized their value.
		Only when finalized do we want to update our parent App.
	*/
	onUpdate(event) {
		var input = event.target
		this.state.onUpdate(event)
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
