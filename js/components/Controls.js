import React from "react";
import ReactDOM from "react-dom";
import Slider from './Slider'

export default class Controls extends React.Component {

	constructor(props) {
		super(props)
    this.state = {
      updateSearchCriteria: props.updateSearchCriteria
    }
	}

  onUpdate(sliderVal, range) {
    var update = {
      [sliderVal]: range
    }
    this.state.updateSearchCriteria(update)
  }

	render() {
    	return (<div id="controls">
                <div id='controls-left'>
            			<Slider title='Beds' min_value={0} max_value={10} low={this.props.searchCriteria.bedrooms[0]} high={this.props.searchCriteria.bedrooms[1]} onUpdate={this.onUpdate.bind(this, 'bedrooms')} />
            			<Slider title='Bath' min_value={0} max_value={10} low={this.props.searchCriteria.bathrooms[0]} high={this.props.searchCriteria.bathrooms[1]} onUpdate={this.onUpdate.bind(this), 'bathrooms'} />
                </div>
                <div id='controls-center'>
            			<Slider title='Price' min_value={0} max_value={100000000} low={this.props.searchCriteria.price[0]} high={this.props.searchCriteria.price[1]} onUpdate={this.onUpdate.bind(this, 'price')} />
            			<Slider title='sq.ft.' min_value={0} max_value={10000} low={this.props.searchCriteria.sqft[0]} high={this.props.searchCriteria.sqft[1]} onUpdate={this.onUpdate.bind(this, 'sqft')} />
                </div>
                <div id='controls-right'>
                  <p>Loading: {this.props.offset}/{this.props.count}</p>
                  {this.props.busy | this.props.changed ? <img src="box.gif" width="60" />: ""}
                </div>
           </div>)
  }
}
