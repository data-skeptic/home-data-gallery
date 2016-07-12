	function heatmap(container, data) {
		$(container).html('')
		var width = $(container).width()
		var height = $(container).height()
		var xoffset = 30 // Going to use this to put axis in
		var yoffset = 30
		var max_r = data[0].r
		var max_c = data[0].c
		var min_r = data[0].r
		var min_c = data[0].c

		var scount = 0
		var mcount = 0
		data.forEach(function(item) {
			scount += item['count']
			if (item['count'] > mcount) {
				mcount = item['count']
			}
			if (item['r'] > max_r) {
				max_r = item['r']
			}
			if (item['c'] > max_c) {
				max_c = item['c']
			}
			if (item['r'] < min_r) {
				min_r = item['r']
			}
			if (item['c'] < min_c) {
				min_c = item['c']
			}
		})
		var w = (width  - xoffset) / (max_r - min_r + 1)
		var h = (height - yoffset) / (max_c - min_c + 1)

		var svgContainer = d3.select(container).append("svg")
		                                    .attr("width", width)
		                                    .attr("height", height);

		var rects = svgContainer.selectAll("rect")
		                          .data(data)
		                          .enter()
		                          .append("rect");

		function dec2hex(dec) {
		    return Number(parseInt( dec , 10)).toString(16);
		}
		var rectAttributes = rects
	           .attr("x", function (d) { return (d.r - min_r) * w + xoffset; })
	           .attr("y", function (d) {
	           		y = (height-yoffset) - (d.c - min_c + 1) / (max_c - min_c + 1) * (height-yoffset)
	           		return y
	           	})
	           .attr("width", function (d) { return w; })
	           .attr("height", function (d) { return h; })
	           .style("fill", function(d) { 
					var percentage = 0.4;
					var color_part_dec = d.count / mcount * 255;
					var color_part_hex = dec2hex( color_part_dec );
					var color = "#" + color_part_hex + color_part_hex + "00";
					return color;
				});
		var text = svgContainer.selectAll("text")
		                        .data(data)
		                        .enter()
		                        .append("text");
		var textAttributes = text
			           .attr("x", function (d) { return (d.r - min_r) * w + xoffset + w/2 })
			           .attr("y", function (d) {
			           		y = (height-yoffset) - (d.c - min_c + 1) / (max_c - min_c + 1) * (height-yoffset) + h/2
			           		return y
			           	})
			           .attr("text-anchor", "middle")
			           .text(function (d) { return d.count })
		// max_r, max_c
   	}

