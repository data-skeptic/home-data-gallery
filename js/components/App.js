import React from "react";
import ReactDOM from "react-dom";

import Header from './Header'
import Controls from './Controls'
import DataView from './DataView'
import Footer from './Footer'
import LocalStorageIO from './LocalStorageIO'

import $ from 'jquery'
import _ from 'lodash'

var local_storage_version = "1.0.5"

const localStorageIO = new LocalStorageIO(local_storage_version)

export default class App extends React.Component {

	constructor(props) {
		super(props)

		var state = this.getPersistentState()
		var searchCriteria = state.searchCriteria
		var listings = []
		state.listings = listings
		state.requires_refresh = false
		this.state = state

		this.doApiPull = this.doApiPull.bind(this)
		this.curlRequest = this.curlRequest.bind(this)
		this.addNewProperties = this.addNewProperties.bind(this)
		this.updateSearchCriteria = this.updateSearchCriteria.bind(this)
		this.setPositionAndZoom = this.setPositionAndZoom.bind(this)
		this.savePersistentState = this.savePersistentState.bind(this)
		this.has_moved = this.has_moved.bind(this)
	}

	componentDidMount() {
	}

	componentWillUnmount() {
		clearInterval(this.time)
	}

	getPersistentState() {
		// TODO: Read the user's location directly
		var position = {latitude: 33.7, longitude: -118.2}
		var zoom = 7
		var bounds = undefined
		var searchCriteria = {
			price: [0, 5000000],
			bedrooms: [0, 8],
			bathrooms: [0, 7],
			sqft: [100, 4000],
		}
		var state = {
			network_ok: true,
			waiting: false,
			count: 0,
			limit: 100,
			offset: 0,
			numCalls: 0,
			changed: false,
			busy: false,
			oneLoadComplete: false,
			searchCriteria: searchCriteria,
			position: position,
			zoom: zoom,
			bounds: bounds
		}
		var saved = localStorageIO.getPersistentState()
		if (saved != undefined) {
			var keys = Object.keys(saved)
			for (var i=0; i < keys.length; i++) {
				var key = keys[i]
				var val = saved[key]
				state[key] = val
			}
		}
		return state
	}

	savePersistentState() {
		localStorageIO.savePersistentState(this.state)
	}

	/*
		This function is called by `Controls` which sends updates
		only when the user has finished changing a slider component
	*/
	updateSearchCriteria(ncriteria) {
		var uSearchCriteria = _.extend({}, this.state.searchCriteria);
		var keys = Object.keys(ncriteria)
		for (var i=0; i < keys.length; i++) {
			var key = keys[i]
			var range = ncriteria[key]
			uSearchCriteria[key] = range
		}
		// Disable visible listings that no longer qualify; check cache for hidden new qualifiers
		var bounds = this.state.bounds
		var update = localStorageIO.update_local_cache(uSearchCriteria, bounds)
		var nlistings = update['visible']
		var nstate = {listings: nlistings, searchCriteria: uSearchCriteria, offset: 0, count: 1}
		this.setState(nstate)

		// Start ajax for API updates
		this.doApiPull()
	}

	addNewProperties(resp) {
		var s2 = new Date().getTime()
		var listings = resp["results"]
		var count = resp['count']
		var offset = this.state.offset + resp['results'].length
		var filters = {}
		var searchCriteria = this.state.searchCriteria
		var bounds = this.state.bounds
		var listings = localStorageIO.update_and_cache(resp, searchCriteria, bounds)
		var s3 = new Date().getTime()
		this.setState({count, offset, listings})
		var s4 = new Date().getTime()
		console.log(['Times to update:', s4-s3, s3-s2])
	}

	setPositionAndZoom(position, zoom, leaflet_bounds) {
		var bounds = {
			right:  leaflet_bounds._northEast.lat,
			top:    leaflet_bounds._northEast.lng,
			left:   leaflet_bounds._southWest.lat,
			bottom: leaflet_bounds._southWest.lng
		}
		var prev = {position: this.state.position, zoom: this.state.zoom}
		var now = {position: position, zoom: zoom}
		var fn = function() {
			this.doApiPull()
		}
		if (this.state.bounds == undefined || this.has_moved(prev, now)) {
			this.setState({position, zoom, bounds, offset: 0, count: 1}, fn)
			this.savePersistentState()
		} else {
			this.setState({bounds, offset: 0, count: 1}, fn)
		}
	}

	haversineDistance(p1, p2, isMiles=1) {
		function toRad(x) {
			return x * Math.PI / 180;
		}
		var lat1 = p1['latitude']
		if (lat1 == undefined && p1['address_object'] != undefined)
			lat1 = p1['address_object']['latitude']
		var lon1 = p1['longitude']
		if (lon1 == undefined && p1['address_object'] != undefined)
			lon1 = p1['address_object']['longitude']

		if (lat1 == undefined || lon1 == undefined) {
			return 99999999
		}

		var lat2 = p2['latitude']
		if (lat2 == undefined && p2['address_object'] != undefined)
			lat2 = p2['address_object']['latitude']
		var lon2 = p2['longitude']
		if (lon2 == undefined && p2['address_object'] != undefined)
			lon2 = p2['address_object']['longitude']

		if (lat2 == undefined || lon2 == undefined) {
			return 99999999
		}

		var R = 6371; // km
		var x1 = lat2 - lat1;
		var dLat = toRad(x1);
		var x2 = lon2 - lon1;
		var dLon = toRad(x2)
		var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		var d = R * c;
		if(isMiles) d /= 1.60934;
		return d;
	}

	curlRequest() {
		var position = this.state.position
		var searchCriteria = this.state.searchCriteria
		var minprice = searchCriteria.price[0]
		var maxprice = searchCriteria.price[1]
		var minbed = searchCriteria.bedrooms[0]
		var maxbed = searchCriteria.bedrooms[1]
		var minbath = searchCriteria.bathrooms[0]
		var maxbath = searchCriteria.bathrooms[1]
		var minsqft = searchCriteria.sqft[0]
		var maxsqft = searchCriteria.sqft[1]
		var curl = `http://api.openhouseproject.co/api/property/?min_price=${minprice}&max_price=${maxprice}&min_bedrooms=${minbed}&max_bedrooms=${maxbed}&min_bathrooms=${minbath}&max_bathrooms=${maxbath}&min_building_size=${minsqft}&max_building_size=${maxsqft}`
		var lat = position.latitude
		var lng = position.longitude
		var bounds = this.state.bounds
		var rad = 0
		if (bounds != undefined) {
			var corner = {latitude: bounds.left, longitude: bounds.top}
			rad = this.haversineDistance(position, corner)
		}
		curl = curl + "&close_to=(" + rad + "," + lat + "," + lng + ")"
		return curl
	}

	loadMore() {
		console.log("Load more")
		this.doApiPull()
	}

	doApiPull() {
		/*
			If an API call is in progress, let it finish - no parallel calls.
			This flag will tell the function to re-run immediately.
		*/
		if (this.state.busy) {
			console.log("Api is busy, queued request for update")
			var requires_refresh = true
			this.setState({requires_refresh})
		}
		else {
			// Nothing to wait for, go ahead and call
			this.callApi()
		}
	}

	callApi() {
		console.log("callApi")
		var offset = this.state.offset
		var limit = this.state.limit
		var count = this.state.count
		if (this.state.bounds == undefined) {
			console.log("Skipping first api call because bounds not loaded yet")
			return
		}
		if ((offset < count || count == 0 && !this.state.oneLoadComplete) || offset == 0 && count > 0) {
			var curl = this.curlRequest()
			var url = curl + `&limit=${limit}&offset=${offset}`
			var me = this
			var prev = {position: this.state.position, scale: this.state.scale}
			console.log(url)
			var t0 = new Date().getTime()
			var numCalls = this.state.numCalls + 1
			var busy = true
			this.setState({busy, numCalls})
			$.ajax({
			  url: url,
			  type: 'GET',
			  contentType: 'text/json',
			  dataType: 'json',
			  success: function (resp) {
				var t1 = new Date().getTime()
			  	console.log(["Api return result:", resp['results'].length, resp['count']])
				me.addNewProperties(resp)
			  	var now = {position: me.state.position, scale: me.state.scale}
			  	me.setState({busy: false, oneLoadComplete: true})
				var t2 = new Date().getTime()
				console.log(["timing", t2-t1, t1-t0])
				if (me.state.requires_refresh) {
					console.log("Handling queued request")
					var requires_refresh = false
					me.setState({requires_refresh, busy})
					me.callApi()
				}
			  },
			  error: function (xhr, ajaxOptions, thrownError) {
			  	console.log("fail")
			  	console.log(me)
			  	me.setState({network_ok: false, busy: false})
			  }
			})
		}
		else {
			console.log("Skipping API call")
			console.log([offset, count, this.state.oneLoadComplete])
		}
	}

	has_moved(prev, now) {
		var pos1 = prev.position
		var pos2 = now.position
		var scale1 = prev.zoom
		var scale2 = now.zoom
		var delta = 0.000001
		if (Math.abs(pos1.latitude - pos2.latitude) > delta) {
			return true
		}
		if (Math.abs(pos1.longitude - pos2.longitude) > delta) {
			return true
		}
		if (scale1 != scale2) {
			return true
		}
		return false
	}

	render() {
		var curlRequestFn = this.curlRequest
		var first_run = true
		if (this.state.numCalls > 0) {
			first_run = false
		}
		var busy = this.state.busy
	    return (<div>
	    		  <Header />
	    		  <Controls curlRequestFn={curlRequestFn} first_run={first_run} nlistings={this.state.listings.length} count={this.state.count} offset={this.state.offset} busy={busy} changed={this.state.changed} network_ok={this.state.network_ok} searchCriteria={this.state.searchCriteria} updateSearchCriteria={this.updateSearchCriteria.bind(this)} loadMore={this.loadMore.bind(this)} />
	    		  <DataView position={this.state.position} zoom={this.state.zoom} setPositionAndZoom={this.setPositionAndZoom.bind(this)} listings={this.state.listings} oneLoadComplete={this.state.oneLoadComplete} />
	    		  <Footer />
	           </div>)
	}
}
