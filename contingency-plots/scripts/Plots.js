import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import readLocalStorageToDict from './readFieldsFromLocalStorage.jsx'
import './App.css'
import rd3 from 'rd3'
import d3 from 'd3'
import randomBates from 'd3-random'
// import DataFrame from 'dataFrame'

export default class Plots extends Component {
  constructor() {
    super()
    this.state = {      
    }
    console.log("initializing plots")
  }
  render() {
    return (
      <div className="Plots">
        <div className="Plot-header">
          <h2>Plots</h2>
        </div>
        <p className="App-intro">
          Edit <code>component/Plots.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

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

/* 2nd component - barChart*/
var barData = [
  {
    "name": "91130",
    "values": [
      { "x": 0, "y": 0},
      { "x": 100000, "y": 314},
      { "x": 200000, "y": 138},
      { "x": 300000, "y": 0},
      { "x": 400000, "y": 0},
      { "x": 500000, "y": 0},
      { "x": 600000, "y": 0},
      { "x": 700000, "y": 0},
      { "x": 800000, "y": 0},
      { "x": 900000, "y": 0},
      { "x": 1000000, "y": 0},
      { "x": 1100000, "y": 0},
      { "x": 1200000, "y": 0},
      { "x": 1300000, "y": 0},
      { "x": 1400000, "y": 0},
      { "x": 1500000, "y": 0},
      { "x": 1600000, "y": 0},
      { "x": 1700000, "y": 1},
    ]
  }
];

var BarChart = rd3.BarChart;

var BarComp = React.createClass({
  render: function() {
    return  (
      <BarChart
      data={barData}
      width={500}
      height={300}
      title="Price Histogram"
      xAxisLabel="Price Bins"
      yAxisLabel="No. Properties"
      />
  )}
});

ReactDOM.render(
  <BarComp />,
  document.getElementById('bar-chart')
);


/* 3rd component */
var ScatterChart = rd3.ScatterChart;

    var scatterData1 = [
      {
        name: "series1",
        values: [ { x: 110, y: 20 }, { x: 150, y: 71 }, { x: 800, y: 32 }, { x: 1300, y: 33 }, { x: 1200, y: 10 }, { x: 1310, y: 15 }, { x: 2410, y: 18 }, { x: 2510, y: 15 }, { x: 1610, y: 12 }, { x: 1630, y: 32 }, { x: 1930, y: 30 }, { x: 1477, y: 30 }]
      }
    ];


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

var ScatterComp = React.createClass({
  render: function() {
    return  (
      <ScatterChart
        data={scatterData1}
        width={500}
        height={400}
        title="Scatter Chart"
        xAxisLabel="Price ($K)"
        yAxisLabel="Area (Sqrt Ft)"
        domain={{x:[-15,], y:[-15,]}}
      />
  )}
});

ReactDOM.render(
  <ScatterComp />,
  document.getElementById('scatter-chart')
);