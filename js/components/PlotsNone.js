import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Carousel from 'nuka-carousel'

import BarComp from './BarComp'
import ScatterComp from './ScatterComp'

export default class PlotsNone extends Component {
	constructor(props) {
    	super(props)
    }
	render() {
		return (
			<div class="plots-empty">
				No listings in this area
			</div>
    	)
	}
}
