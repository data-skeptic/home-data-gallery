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

  onClick() {
    this.props.loadMore()
  }

	render() {
    var curl = this.state.curlRequestFn()
    this.state.value = curl
    var loadingMessage = <p>Loading...</p>
    if (this.props.busy || this.props.changed || this.props.first_run) {
      if (this.props.offset == 0 && this.props.count == 1) {
        loadingMessage = <div class="alert alert-info" role="alert">
                            <strong>Hang fire a second!</strong> We&apos;re looking for properties in this area.
                            <img src="box.gif" class="float-xs-right" alt="Loading image" width="40"/>
                          </div>
      }
      else {
        loadingMessage = <div class="alert alert-info" role="alert">
                            <strong>Hang fire a second!</strong> We&apos;re searching for additional listings...
                            <img src="box.gif" class="float-xs-right" alt="Loading image" width="40"/>
                          </div>
      }
    } else {
      if (this.props.nlistings > 0) {
        var ratio = 1.0 * this.props.offset / this.props.count
        var sample_size_shown = parseInt(ratio*100).toString()
        if (ratio < .01) {
          sample_size_shown = "<1"
        }
        if (ratio < 1.0) {
          loadingMessage = <div class="alert alert-success" role="alert">
                              <strong>Found some properties!</strong> Sample size shown: {sample_size_shown}% 
                              <button className="btn-load-more" onClick={this.onClick.bind(this)}>Load more</button>
                            </div>
        } else {
          loadingMessage = <div class="alert alert-success" role="alert">
                              <strong>Found some properties!</strong> Sample size shown: {sample_size_shown}% 
                            </div>          
        }
      } else {
        loadingMessage = <div class="alert alert-danger alert-dismissible" role="alert">
                          <strong>Oh crumbs!</strong> We didnt find any properties. Try changing the filters above.
                          </div>
      }
    }
    return (
<div>
  <div id="filters" class="container">
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
          <pre class="rfiddleHelper" hidden>
{`# Pull in the rjson library to parse the JSON output from the OpenHouseProject API
library("rjson")

# Fetch the json data the API
json_data <- fromJSON(file="` + 
this.state.value + 
`")

#Mold this into a data frame
properties_frame <- lapply(json_data$results, function(x) {
  x[sapply(x, is.null)] <- NA
  unlist(x)
})
properties <- do.call("rbind", properties_frame)

# Grab the prices as numeric type and plot a basic histogram on the data
prices <- as.numeric(as.character(properties[,19]))
hist(prices)
`}
          </pre>
          <a class="btn btn-primary" href={"http://www.r-fiddle.org/#/query/fiddle?code=" + encodeURIComponent($('pre.rfiddleHelper').text())} target="_blank">Open dataset in R-Fiddle</a>
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
