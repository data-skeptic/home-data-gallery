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
    var loadingMessage = <p>Loading...</p>
    if (this.props.busy || this.props.changed) {
      if (this.props.offset == 0 && this.props.count == 1) {
        loadingMessage = <p>Looking in this area...</p>
      }
      else {
        loadingMessage = <p>Checking for more listings...</p>
      }
    } else {
      if (this.props.count > 0) {
        var ratio = 1.0 * this.props.offset / this.props.count
        loadingMessage = <p>Sample size shown: {parseInt(ratio*100).toString()}%</p>
      } else {
        loadingMessage = <p>No records found.</p>
      }
    }
    return (<div id="controls" class="row">
              <div class="col-sm-3">
          			<Slider title='Beds' min_value={0} max_value={10} low={this.props.searchCriteria.bedrooms[0]} high={this.props.searchCriteria.bedrooms[1]} onUpdate={this.onUpdate.bind(this, 'bedrooms')} />
          			<Slider title='Bath' min_value={0} max_value={10} low={this.props.searchCriteria.bathrooms[0]} high={this.props.searchCriteria.bathrooms[1]} onUpdate={this.onUpdate.bind(this, 'bathrooms')} />
              </div>
              <div class="col-sm-3">
          			<Slider title='Price' min_value={0} max_value={10000000} low={this.props.searchCriteria.price[0]} high={this.props.searchCriteria.price[1]} onUpdate={this.onUpdate.bind(this, 'price')} />
          			<Slider title='sq.ft.' min_value={0} max_value={10000} low={this.props.searchCriteria.sqft[0]} high={this.props.searchCriteria.sqft[1]} onUpdate={this.onUpdate.bind(this, 'sqft')} />
              </div>
              <div class="col-sm-6">
              {this.props.network_ok ? "": "Network issues!"}
                {loadingMessage}
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
