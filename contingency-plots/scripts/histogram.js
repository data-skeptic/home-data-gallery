function histogram(container, series, w, h) {
  var values = series
  var formatCount = d3.format(",.0f");

  var margin = {top: 20, right: 15, bottom: 60, left: 60}
      width = w - margin.left - margin.right,
      height = h - margin.top - margin.bottom;

  mmin = Math.min(...values)
  mmax = Math.max(...values)
  var x = d3.scale.linear()
      .domain([mmin, mmax+1])
      .range([0, height]);

  var data = d3.layout.histogram()
      .bins(x.ticks(10))
      (values);

  var y = d3.scale.linear()
      .domain([0, d3.max(data, function(d) { return d.y; })])
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var nticks = mmax - mmin + 1
  if (nticks > 10) {
    nticks = 3
  }
  xAxis.ticks(nticks)

  $(container).html('')
  var svg = d3.select(container).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var bar = svg.selectAll(".bar")
      .data(data)
    .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d) {
          var xx = x(d.x)
          var yy = y(d.y)
          return "translate(" + xx + "," + yy + ")"; 
      });

  var barwidth = w/(mmax - mmin+1)/3
  var minbar = 4
  if (barwidth < minbar) {
    barwidth = minbar
  }
  bar.append("rect")
      .attr("x", 1)
      .attr("width", function(d) { return barwidth })
      .attr("height", function(d) { return height - y(d.y); });

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.5em")
      .attr("dy", ".15em")
      .attr("transform", function(d) {
        return "rotate(-90)"
      })

}

