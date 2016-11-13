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
        loadingMessage = <div class="alert alert-info" role="alert">
                            <strong>Hang fire a second!</strong> Were looking for properties in this area.
                            <img src="box.gif" class="float-xs-right" alt="Loading image" width="40"/>
                          </div>
      }
      else {
        loadingMessage = <div class="alert alert-info" role="alert">
                            <strong>Hang fire a second!</strong> Were checking for more listings...
                            <img src="box.gif" class="float-xs-right" alt="Loading image" width="40"/>
                          </div>
      }
    } else {
      if (this.props.count > 0) {
        var ratio = 1.0 * this.props.offset / this.props.count
        loadingMessage = <div class="alert alert-success" role="alert">
                            <strong>Found some properties!</strong> Sample size shown: {parseInt(ratio*100).toString()}% 
                          </div>
      } else {
        loadingMessage = <div class="alert alert-danger alert-dismissible" role="alert">
                          <strong>Oh crumbs!</strong> We didnt find any properties. Try changing the filters above.
                          </div>
      }
    }
    return (
<div>
  <div id="filters" class="container">
      <h3>Filters</h3>
      <div class="row">
        <div class="col-sm-4">
          <p>Number of bedrooms</p>
          <Slider title='Beds' min_value={0} max_value={10} low={this.props.searchCriteria.bedrooms[0]} high={this.props.searchCriteria.bedrooms[1]} onUpdate={this.onUpdate.bind(this, 'bedrooms')} />
          <p>Number of bathrooms</p>
          <Slider title='Bath' min_value={0} max_value={10} low={this.props.searchCriteria.bathrooms[0]} high={this.props.searchCriteria.bathrooms[1]} onUpdate={this.onUpdate.bind(this, 'bathrooms')} />
        </div>

        <div class="col-sm-4">
          <p>Price</p>
          <Slider title='Price' min_value={0} max_value={10000000} low={this.props.searchCriteria.price[0]} high={this.props.searchCriteria.price[1]} onUpdate={this.onUpdate.bind(this, 'price')} />
          <p>Area (Sq.Ft)</p>
          <Slider title='sq.ft.' min_value={0} max_value={10000} low={this.props.searchCriteria.sqft[0]} high={this.props.searchCriteria.sqft[1]} onUpdate={this.onUpdate.bind(this, 'sqft')} />
        </div>

        <div class="col-sm-4">
          <form class="form">
            <div class="form-group">
              <label for="cURL_textbox">cURL Request: </label>
              <div class="input-group">
                <input type="text" class="form-control" id="cURL_textbox" value={this.state.value} onChange={({target: {value}}) => this.setState({value, copied: false})}/>
                <div class="input-group-addon">
                <CopyToClipboard text={this.state.value} onCopy={() => this.setState({copied: true})}>
                <buton>Copy <img src="copy.png" id='copyPng' alt="Copy to clipboard" /></buton>
                  </CopyToClipboard>
                </div>
              </div>
            </div>
            {this.state.copied ? <span style={{color: 'red'}}> Copied.</span> : null}
          </form>

          <a class="btn btn-primary" href="http://r-fiddle.org/#/query/embed?code=Testcode">Open dataset in R-Fiddle</a>
        </div>
      </div>

      <div class="row">
        {this.props.network_ok ? "" : <div class="alert alert-danger alert-dismissible" role="alert">
                                      <strong>Houston we have a problem!</strong> Cannot connect to Open House Project API.
                                    </div>}
        {loadingMessage}
      </div>
    </div>
</div>
   )
  }
}
