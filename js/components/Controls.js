import React from "react"
import ReactDOM from "react-dom"
import CopyToClipboard from 'react-copy-to-clipboard'

import Slider from './Slider'

export default class Controls extends React.Component {

	constructor(props) {
		super(props)
    this.state = {
      curlRequestFn: this.props.curlRequestFn,
      updateSearchCriteria: this.props.updateSearchCriteria,
      value: this.props.curl,
      copied: false
    }
	}

  onUpdate(sliderVal, range) {
    var update = {
      [sliderVal]: range
    }
    this.state.updateSearchCriteria(update)
  }

  handleCopy(e) {
    console.log("Copied to clipboard.")
  }

	render() {
    var curl = this.state.curlRequestFn()
    this.state.value = curl
  	return (<div id="controls">
              <div id='controls-left'>
          			<Slider title='Beds' min_value={0} max_value={10} low={this.props.searchCriteria.bedrooms[0]} high={this.props.searchCriteria.bedrooms[1]} onUpdate={this.onUpdate.bind(this, 'bedrooms')} />
          			<Slider title='Bath' min_value={0} max_value={10} low={this.props.searchCriteria.bathrooms[0]} high={this.props.searchCriteria.bathrooms[1]} onUpdate={this.onUpdate.bind(this, 'bathrooms')} />
              </div>
              <div id='controls-center'>
          			<Slider title='Price' min_value={0} max_value={100000000} low={this.props.searchCriteria.price[0]} high={this.props.searchCriteria.price[1]} onUpdate={this.onUpdate.bind(this, 'price')} />
          			<Slider title='sq.ft.' min_value={0} max_value={10000} low={this.props.searchCriteria.sqft[0]} high={this.props.searchCriteria.sqft[1]} onUpdate={this.onUpdate.bind(this, 'sqft')} />
              </div>
              <div id='controls-right'>
              {this.props.network_ok ? "": "Network issues!"}
                <p>Loading: {this.props.offset}/{this.props.count}</p>
                {this.props.busy | this.props.changed ? <img src="box.gif" width="60" />: ""}
                <div id='curlBox'>
                  <span class="ui_label">cURL request: </span>
                  <input class='curl' value={this.state.value} onChange={({target: {value}}) => this.setState({value, copied: false})} />&nbsp;

                  <CopyToClipboard text={this.state.value}
                    onCopy={() => this.setState({copied: true})}>
                    <button><img src="copy.png" id='copyPng' alt="Copy to clipboard" /></button>
                  </CopyToClipboard>&nbsp;

                  {this.state.copied ? <span style={{color: 'red'}}>Copied.</span> : null}
                </div>
              </div>
         </div>)
  }
}
