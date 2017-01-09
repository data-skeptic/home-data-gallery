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
			<div class="plots-empty">
				<span class="plots-empty-title">No properties found</span>
				<p>OpenHouse does not yet have any property sales data for this area.
				We're a developing project.  If you know where we might pull from, please
				let us know in the box below.</p>

				<div id="urlbox">
				 <span class="plots-empty-title2">Tell us about a website</span>

				  <table>
				    <tbody>
					    <tr>
					      <td>URL:</td>
					      <td><input id="url" class="box" type="text" value={this.state.url} onChange={this.onUpdate.bind(this)} /></td>
					    </tr>
					    <tr>
					      <td>Email:</td>
					      <td><input id="email" class="box" type="text" value={this.state.email} onChange={this.onUpdate.bind(this)} /></td>
					    </tr>
					    <tr>
					      <td></td>
					      <td><input type="checkbox" id="cb_notify" checked={this.state.cb_notify} onChange={this.onUpdate.bind(this)} />Notify me about updates related to this data</td>
					    </tr>
					    <tr>
					      <td></td>
					      <td>
					      	<button id="btnSubmit" onClick={this.onSubmit.bind(this)}>Submit</button>
					      </td>
					    </tr>
					</tbody>
				  </table>
				  {result}
				</div>
			</div>
    	)
	}
}
