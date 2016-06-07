var baseurl = "https://home-sales-data-api.herokuapp.com"

function render() {
	var min_price = 0
	var max_price = 1000000000
	var min_beds = $('#min_beds').val()
	var max_beds = $('#max_beds').val()
	var min_baths = $('#min_baths').val()
	var max_baths = $('#max_baths').val()
	var min_sqft = $('#min_sqft').val()
	var max_sqft = $('#max_sqft').val()

	request = {'min_price': min_price,
      'max_price': max_price,
      'min_bedrooms': min_beds,
      'max_bedrooms': max_beds,
      'min_bathrooms': min_baths,
      'max_bathrooms': max_baths,
      'min_building_size': min_sqft,
      'max_building_size': max_sqft,
      'limit': '500',
      'offset': '0'
  }

  var murl = baseurl + '/api/property/?'
  var keys = Object.keys(request)
  for (var i in keys) {
  	var item = keys[i]
  	if (i > 0) {
  		murl += "&"
  	}
  	murl += item + "=" + request[item]
  }
  $("#curl").val('curl -X GET "' + murl + '"')
  $.ajax({
  	url: murl,
  	type: 'GET',
  	contentType: 'text/json',
  	dataType: 'json',
  	success: function(resp) {
  		makePlots(resp)
      var mymap = L.map('mapid').setView([51.505, -0.09], 13);
  	},
  	error: function() {
  		console.log('error')
  	}
  })
}

function makePlots(resp) {
  data = resp['results']
  var dims = ['price', 'bathrooms', 'bedrooms', 'building_size']
  var cells = ['Price', 'Beds', 'Baths', 'Sqft']
  if (data['count'] == 0) {
    $(".plotCell").html("")
    $("#errorBox").html("Your search result did not return any properties.")
    $("#errorBox").show()
  }
  else {
    var w = 200
    var h = 200
    for (var r=0; r < dims.length; r++) {
      for (var c=r; c < dims.length; c++) {
        var container = cells[r] + 'V' + cells[c]
        xy = extractData(data, dims[r], dims[c])
        if (r==c) {
          histogram(container, xy['x'], w, h)
        } else {
          scatterplot(container, xy, w, h)
        }
      }
    }    
  }
}

function extractData(data, var1, var2) {
	var pdata = {x: [], y: []}
	for (var d in data) {
		var property = data[d]
    if (property != null) {
  		x = property[var1]
  		y = property[var2]
  		pdata['x'].push(x)
  		pdata['y'].push(y)
    }
	}
	return pdata
}

function histogram(container, series, w, h) {
  var values = series
console.log(series)
  // A formatter for counts.
  var formatCount = d3.format(",.0f");

  var margin = {top: 20, right: 15, bottom: 60, left: 60}
      width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;

  var x = d3.scale.linear()
      .domain([0, Math.max(...values)])
      .range([0, width]);

  var data = d3.layout.histogram()
      .bins(x.ticks(10))
      (values);
console.log([0, d3.max(data, function(d) { return d.y; })])
console.log([height, 0])
  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.y; })])
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  xAxis.ticks(2)

  $("#" + container).html('')
  var svg = d3.select("#" + container).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg.selectAll(".bar")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  bar.append("rect")
      .attr("x", 1)
      .attr("width", x(data[0].dx) - 1)
      .attr("height", function(d) { return height - y(d.y); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
}

function scatterplot(container, xy, w, h) {
  var xdata = xy['x']
  var ydata = xy['y']

  // size and margins for the chart
  var margin = {top: 20, right: 15, bottom: 60, left: 60}
    , width = w - margin.left - margin.right
    , height = h - margin.top - margin.bottom;

  var x = d3.scale.linear()
            .domain([0, d3.max(xdata)])
            .range([ 0, width ])

  var y = d3.scale.linear()
            .domain([0, d3.max(ydata)])
            .range([ height, 0 ])

  $('#' + container).html('')
  var chart = d3.select('#' + container)
  .append('svg:svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)
  .attr('class', 'chart')

  // the main object where the chart and axis will be drawn
  var main = chart.append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .attr('width', width)
  .attr('height', height)
  .attr('class', 'main')   

  // draw the x axis
  var xAxis = d3.svg.axis()
  .scale(x)
  .orient('bottom');

  xAxis.ticks(2)

  main.append('g')
  .attr('transform', 'translate(0,' + height + ')')
  .attr('class', 'main axis date')
  .call(xAxis);

  // draw the y axis
  var yAxis = d3.svg.axis()
  .scale(y)
  .orient('left');

  yAxis.ticks(3)

  main.append('g')
  .attr('transform', 'translate(0,0)')
  .attr('class', 'main axis date')
  .call(yAxis);

  // draw the graph object
  var g = main.append("svg:g"); 

  g.selectAll("scatter-dots")
    .data(ydata)  // using the values in the ydata array
    .enter().append("svg:circle")  // create a new circle for each value
        .attr("cy", function (d) { return y(d); } ) // translate y value to a pixel
        .attr("cx", function (d,i) { return x(xdata[i]); } ) // translate x value
        .attr("r", 2) // radius of circle
        .style("opacity", 0.5); // opacity of circle
}

function showWaiting() {
  $("#errorBox").hide()
	$(".plotCell").html("<img src='box.gif' />")
}

onchange = function() {
  showWaiting()
  render()
}

$( document ).ready(function() {
  $("#min_beds").change(onchange)
  $("#max_beds").change(onchange)
  $("#min_baths").change(onchange)
  $("#max_baths").change(onchange)
  $("#min_sqft").change(onchange)
  $("#max_sqft").change(onchange)

  new Clipboard('#btnCopy');

	showWaiting()
	render()
});


