import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import BarComp from './BarComp'
import ScatterComp from './ScatterComp'

export default class Plots extends Component {
	constructor(props) {
    	super(props)
    	this.state = {}
    	console.log("initializing plots")
		this.getPriceData = this.getPriceData.bind(this)
		this.getScatterData = this.getScatterData.bind(this)
    }
  	getPriceData(listings, col, buckets) {
		var priceData = [
			{
			    "name": "",
			    "values": []
			}
		]
		for (var i=0; i < buckets.length; i++) {
			priceData[0]["values"].push({"x": buckets[i], "y": 0})
		}
    	for (var i=0; i < listings.length; i++) {
	    	var listing = listings[i]
	    	var value = listing[col]
	     	if (value != undefined) {
				var bin = buckets.map(function(b) { return (value > b)+0 })
								.reduce( (prev, curr) => prev + curr )
				priceData[0]["values"][bin-1]["y"] = priceData[0]["values"][bin-1]["y"] + 1
        	}
        }
        return priceData
	}
	getScatterData(listings, col1, col2) {
		var data = [
			{
				name: "",
				values: []
			}
		];
    	for (var i=0; i < listings.length; i++) {
	    	var listing = listings[i]
	    	var x = listing[col1]
	    	var y = listing[col2]
	    	data[0]["values"].push({x: x, y: y})
	    }
		return data
	}
	render() {
		var buckets = [0, 100000, 200000, 300000, 400000, 500000, 750000, 1000000, 10000000, 100000000]
  		var priceData = this.getPriceData(this.props.listings, "price", buckets)
		var scatterData = this.getScatterData(this.props.listings, "price", "building_size")
		return (
			<div className="Plots">
				<div className="Plot-header">
					<h2>Plots</h2>
					<BarComp
						data={priceData}
						width={500}
						height={300}
						title="Price Histogram"
						xAxisLabel="Price Bins"
						yAxisLabel="No. Properties"
					/>
					<ScatterComp
						data={scatterData}
						width={500}
						height={400}
						title="Price vs. sqft"
						xAxisLabel="Price ($K)"
						yAxisLabel="Area (Sqrt Ft)"
						domain={{x:[-15,], y:[-15,]}}
					/>
				</div>
			</div>
    	)
	}
}

/*


// Routine for getting data from localStorage to Histogram (need to refactor)
// Read data from localStorage
var fields = ["price", "bedrooms", "bathrooms",  "building_size"]
var dictData = readLocalStorageToDict(fields)
var data = dictData['price']

var formatCount = d3.format(",.0f");
var margin = {top: 10, right: 30, bottom: 30, left: 30},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

function getYScale(data, height) {
  return d3.scale.linear().
    domain([0, d3.max(data, (d) => d.y)]).
    range([height, 0]);
}

function getXScale(data, width) {
  return d3.scale.linear().
    domain([0, d3.max(data)]).
    range([0, width]);
}

function parseHistogramData(data) {
  var plotDict;
  var plotDictArray = data.map(d => 
    plotDict = {"x":d.x, "y":d.length}
  )
  return plotDictArray
}

var x = d3.scale.linear().rangeRound([0, width]);
var xScale = getXScale(data, width);
var histogramDataFn = d3.layout.histogram().bins(xScale.ticks(20));
// This is the data we parse to React component
var histogramData = histogramDataFn(data);
var yScale = getYScale(histogramData, height);
var bins = d3.layout.histogram().bins(xScale.ticks(20));

var barValues = parseHistogramData(histogramData)
var barData = [
  {
    "name": "price",
    "values": barValues
  }
]






















// 
function parseScatterData(data, fields) {
  var plotDict;
  var xData = data[fields[0]]
  var yData = data[fields[1]]
  var plotDictArray = xData.map((x, i) => 
    plotDict = {"x": x, "y":yData[i]}
  )
  return plotDictArray
}

var scatterFields = ['price', 'building_size']
var scatterValues = parseScatterData(dictData, scatterFields)
var scatterData = [
  {
    name: "price_vs_buildingsize",
    values: scatterValues
  }
]

*/
