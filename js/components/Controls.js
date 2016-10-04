import React from "react";
import ReactDOM from "react-dom";
import MSlider from './Slider'

export default class Controls extends React.Component {

	constructor(props) {
		super(props)
	}

	render() {
    	return (<div id="controls">
                <div id='controls-left'>
            			<MSlider title='Beds' />
            			<MSlider title='Bath' />
                </div>
                <div id='controls-center'>
            			<MSlider title='Price' />
            			<MSlider title='sq.ft.' />
                </div>
                <div id='controls-right'>
                  <p>Loading: {this.props.offset}/{this.props.count}</p>
                  {this.props.busy | this.props.changed ? <img src="box.gif" width="60" />: ""}
                </div>
           </div>)
  }
}
