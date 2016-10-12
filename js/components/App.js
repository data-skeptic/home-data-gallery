import React from "react";
import ReactDOM from "react-dom";

import Header from './Header'
import Controls from './Controls'
import DataView from './DataView'
import Footer from './Footer'

import $ from 'jquery'

export default class App extends React.Component {

	constructor(props) {
		super(props)

		var listings = [
		  {
		  	listing_timestamp: "Loading...",
		  	listing_type: "Loading...",
		  	price: "Loading...",
		  	bedrooms: "Loading...",
		  	bathrooms: "Loading...",
		  	car_spaces: "Loading...",
		  	building_size: "Loading...",
		  	land_size: "Loading...",
		  	size_units: "Loading...",
		  	address: "Loading..."
		  }
		];
		var searchCriteria = {
			price: [0, 1000000],
			bedrooms: [0, 8],
			bathrooms: [0, 7],
			sqft: [100, 4000],
		}
		this.state = {
			listings: listings,
			waiting: false,
			count: 1,
			limit: 5,
			offset: 0,
			numCalls: 0,
			changed: false,
			busy: false,
			curl: '',
			searchCriteria: searchCriteria
		}
		this.tick = this.tick.bind(this)
		this.addNewProperties = this.addNewProperties.bind(this)
		this.updateSearchCriteria = this.updateSearchCriteria.bind(this)
	}
	componentDidMount() {
		this.timer = setInterval(this.tick, 1000)
	}

	componentWillUnmount() {
		clearInterval(this.time)
	}

	/*
		This function is called by `Controls` which sends updates
		only when the user has finished changing a slider component
	*/
	updateSearchCriteria(ncriteria) {
		var criteria = this.state
		var keys = Object.keys(ncriteria)
		for (var i=0; i < keys.length; i++) {
			var key = keys[i]
			var range = ncriteria[key]
			var sc = criteria.searchCriteria
			sc[key] = range
		}
		this.setState({criteria: criteria, offset: 0, count: 1})
		// TODO: update from cache
		// TODO: update ajax
	}
	addNewProperties(resp) {
		var listings = resp["results"]
		var count = resp['count']
		var offset = resp['results'].length
		// TODO: Better forward crawling management
		var busy = true
		if (true) { // This line tells it to give up after 1 call, good for development
			offset = count
			busy = false
		}
		this.setState({count, offset, busy, listings})
		// TODO: import kd tree and do eviction
		// TODO: Do filtering
	  	/*
	    writeLocalStorage(resp) // localStorageIO.js
	    var bounds = map.getExtent().clone()
	    bbox = bounds.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"))
	    this.filters = get_request()
	    results = readPropertiesFromLocalStorage(bbox, this.filters)
	    */
	}
	tick() {
		if (!this.state.busy) {
			var offset = this.state.offset
			var limit = this.state.limit
			var count = this.state.count
			var minprice = this.state.searchCriteria.price[0]
			var maxprice = this.state.searchCriteria.price[1]
			var minbed = this.state.searchCriteria.bedrooms[0]
			var maxbed = this.state.searchCriteria.bedrooms[1]
			var minbath = this.state.searchCriteria.bathrooms[0]
			var maxbath = this.state.searchCriteria.bathrooms[1]
			var minsqft = this.state.searchCriteria.sqft[0]
			var maxsqft = this.state.searchCriteria.sqft[1]
			if (offset < count) {
				var curl = `http://api.openhouseproject.co/api/property/?min_price=${minprice}&max_price=${maxprice}&min_bedrooms=${minbed}&max_bedrooms=${maxbed}&min_bathrooms=${minbath}&max_bathrooms=${maxbath}&min_building_size=${minsqft}&max_building_size=${maxsqft}`
				var url = curl + `&limit=${limit}&offset=${offset}`
				this.setState({busy: true, curl: curl})
				var me = this
				$.ajax({
				  url: url,
				  type: 'GET',
				  contentType: 'text/json',
				  dataType: 'json',
				  success: this.addNewProperties,
				  error: function (xhr, ajaxOptions, thrownError) {
				    console.log(thrownError)
				    //api.busy = false
				  }
				})
			}
		}
	}

	render() {
	    return (<div>
	    		  <Header />
	    		  <Controls count={this.state.count} offset={this.state.offset} busy={this.state.busy} curl={this.state.curl} changed={this.state.changed} searchCriteria={this.state.searchCriteria} updateSearchCriteria={this.updateSearchCriteria.bind(this)} />
	    		  <DataView listings={this.state.listings} />
	    		  <Footer />
	           </div>)
	}
}
