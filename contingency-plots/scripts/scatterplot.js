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

  $(container).html('')
  var chart = d3.select(container)
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

  xAxis.ticks(4)

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
  var g = main.append("svg:g")
  g.selectAll("scatter-dots")
    .data(ydata)  // using the values in the ydata array
    .enter().append("svg:circle")  // create a new circle for each value
        .attr("cy", function (d,i) { return y(ydata[i]); } ) // translate y value to a pixel
        .attr("cx", function (d,i) { return x(xdata[i]); } ) // translate x value
        .attr("r", 2) // radius of circle
        .style("opacity", 0.5); // opacity of circle
}

