import React from "react";
import ReactDOM from "react-dom";
import DataTable from './components/DataTable'

var url = "http://api.openhouseproject.co/api/property/?min_price=100000&max_price=10000000&min_bedrooms=1&max_bedrooms=3&min_bathrooms=1&max_bathrooms=2&min_building_size=0&max_building_size=10000&limit=5&offset=0"

var items = [
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

const datatable = document.getElementById('datatable')
React.render(<DataTable rows= { items }/>, datatable)

var $ = require('jquery')

console.log(url)

$.ajax({
  url: url,
  type: 'GET',
  contentType: 'text/json',
  dataType: 'json',
  success: function(resp) {
  	console.log("success")
  	var listings = resp["results"]
  	for (var i=0; i < listings.length; i++) {
  		var listing = listings[i]
  		delete listing['id']
  		delete listing['submitter']
  		delete listing['upload_timestamp']
  		delete listing['raw_address']
  		delete listing['valid']
  		delete listing['features']
  		listing['address'] = listing['address_object']['formatted_address']
  		delete listing['address_object']
  	}
	React.render(<DataTable rows= { listings }/>, datatable)
  	/*
    writeLocalStorage(resp) // localStorageIO.js
    api.count = resp['count']
    api.offset += resp['results'].length
    var bounds = map.getExtent().clone()
    bbox = bounds.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"))
    this.filters = get_request()
    results = readPropertiesFromLocalStorage(bbox, this.filters)
    updateMap(results)
    updateTable(results) // updateTable.js
    makePlots(results)
    api.busy = false
    $(".wait-spinner").hide()
    */
  },
  error: function (xhr, ajaxOptions, thrownError) {
    //console.log(xhr.responseText)
    console.log(thrownError)
    //api.busy = false
  }
})

