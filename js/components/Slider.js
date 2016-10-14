import React from "react"
import ReactDOM from "react-dom"

import Nouislider from 'react-nouislider'

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

	onUpdate(event) {
		var input = event.target
		//console.log(event)
	}

	render() {
		var min_value = this.state.min_value
		var max_value = this.state.max_value
		var start_low = this.state.low
		var start_high = this.state.high
    	return (<div class='slider'>
				  <Nouislider
				  	onUpdate={this.onUpdate}
				    range={{min: min_value, max: max_value}}
				    start={[start_low, start_high]}
				  />
      		<center><span class='slider_label'>{this.props.title}: {start_low} to {start_high}</span></center>
           </div>)
	}
}
/*
	noUiSlider.create(slider, {
		start: start,
		connect: true,
		range: {
			'min': [min_val],
			'1%': [min_val, 1],
			'max': [max_val]
		}
	})

	slider.noUiSlider.on('update', function( values, handle ) {
		svals = slider.noUiSlider.get()
		low = parseFloat(svals[0])
		high = parseFloat(svals[1])
		content = "<center><span class='slider_label'>" + label + low + " to " + high + "</span></center>"
		value_pane.html(content)

}
*/