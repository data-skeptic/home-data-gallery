import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import Carousel from 'nuka-carousel'

import BarComp from './BarComp'
import ScatterComp from './ScatterComp'

import $ from 'jquery'

export default class PlotsNone extends Component {
	constructor(props) {
    	super(props)
    	this.state = {
    		result: "none",
    		email: "",
    		url: "http://",
    		cb_notify: true
    	}
    	this.onSubmit = this.onSubmit.bind(this)
    }
    onUpdate(e) {
    	console.log(e.target)
    	var att = e.target.id
    	var value = e.target.value
    	var u = {}
    	u[att] = value
    	console.log(u)
    	this.setState(u)
    }
    onSubmit() {
	    var api = "https://5xwvsgjnqi.execute-api.us-east-1.amazonaws.com/prod/OH-submit-url"
	    var email = this.state.email
	    var url = this.state.url
	    var checked = this.state.cb_notify
	    var res = {"email": email, "url": url, "checked": checked}
	    this.setState({result: "submitting"})
	    var me = this
	    $.ajax({
	      url: api,
	      type: 'POST',
	      contentType: 'text/json',
	      dataType: 'json',
	      data: JSON.stringify(res),
	      success: function (resp) {
		    me.setState({result: "thanks"})
	      },
	      error: function (xhr, ajaxOptions, thrownError) {
		    me.setState({result: "error"})
	      }
	    })
    }
	render() {
		var result = ""
		if (this.state.result == "thanks") {
			result = <div class="alertbox" class="thanks">Thanks</div>
		} else if (this.state.result == "submitting") {
			result = <div class="alertbox" class="waiting">Submitting...</div>
		} else if (this.state.result == "error") {
			result = <div class="alertbox" class="error">An error has occured.  That stinks!  I guess just email <a href="mailto:kyle@dataskeptic.com">kyle@dataskeptic.com</a>.  Send him your recommended URL and comment on how ashamed he should be that the site is broken.</div>
		}
				  
		return (
				<div class="row">
					<h4>No properties found!</h4>
					<p>
						OpenHouse does not yet have any property sales data for this area.
						We're a developing project.  <strong>If you know where we might pull from, please
						let us know in the box below.</strong>
					</p>
				    <div class="form-group row">
				      <label for="email" class="col-sm-2 col-form-label">Email</label>
				      <div class="col-sm-10">
				        <input type="email" class="form-control" id="email" placeholder="Email" />
				      </div>
				    </div>
				    <div class="form-group row">
				      <label for="url" class="col-sm-2 col-form-label">URL</label>
				      <div class="col-sm-10">
				        <input type="text" class="form-control" id="url" placeholder="https://" />
				      </div>
				    </div>
				    <div class="form-group row">
				      <label class="col-sm-2"></label>
				      <div class="col-sm-10">
				        <div class="form-check">
				          <label class="form-check-label">
				            <input class="form-check-input" type="checkbox" id="cb_notify" checked /> Notify me about updates related to this data
				          </label>
				        </div>
				      </div>
				    </div>
				    <div class="form-group row">
				      <div class="offset-sm-2 col-sm-10">
				        <button type="submit" class="btn btn-primary" onClick={this.onSubmit.bind(this)}>Submit</button>
				      </div>
				      {result}
				    </div>
				</div>
    	)
	}
}
