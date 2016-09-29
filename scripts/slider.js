function slider(container, min_val, max_val, start, label) {
	if (container[0] == "#") {
		container = container.substring(1, container.length)
	}
	var slider = document.getElementById(container)
	noUiSlider.create(slider, {
		start: start,
		connect: true,
		range: {
			'min': [min_val],
			'1%': [min_val, 1],
			'max': [max_val]
		}
	})
	var value_pane = $("#" + container + '_val');
	slider.noUiSlider.on('update', function( values, handle ) {
		svals = slider.noUiSlider.get()
		low = parseFloat(svals[0])
		high = parseFloat(svals[1])
		content = "<center><span class='slider_label'>" + label + low + " to " + high + "</span></center>"
		value_pane.html(content)
	});
	return slider
}