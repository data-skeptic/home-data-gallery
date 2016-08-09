var baseurl = "http://api.openhouseproject.co"

var response = null

function render() {
  var min_price = 0
  var max_price = 1000000000
  svals = sliders['bed'].noUiSlider.get()
  var min_beds = parseFloat(svals[0])
  var max_beds = parseFloat(svals[1])
  svals = sliders['bath'].noUiSlider.get()
  var min_baths = parseFloat(svals[0])
  var max_baths = parseFloat(svals[1])
  svals = sliders['sqft'].noUiSlider.get()
  var min_sqft = parseFloat(svals[0])
  var max_sqft = parseFloat(svals[1])
  svals = sliders['price'].noUiSlider.get()

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
      response = resp
      $(".wait-spinner").hide()
      updateTable(resp)
      updateMap(resp)
      makePlots(resp)
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
          histogram("#" + container, xy['x'], w, h)
        } else if (dims[r] == 'bathrooms' && dims[c] == 'bedrooms' || dims[c] == 'bathrooms' && dims[r] == 'bedrooms') {
          agg = aggregateData(data, dims[r], dims[c])
          heatmap("#" + container, agg)
        } else {
          scatterplot('#' + container, xy, w, h)
        }
      }
    }    
  }
}

function updateMap(resp) {
    if (resp['count'] > 0) {
      data = resp['results']
      var latlngs = []
      var error_count = 0
      $.each(data, function(i, elem) {
        var ao = elem['address_object']
        if (ao != null) {
          property = {
            "address": ao['formatted_address'],
            "sale_price": elem['price'],
            "bedrooms": elem['bedrooms'],
            "bathrooms": elem['bathrooms'],
            "latitude": ao['latitude'],
            "longitude": ao['longitude']
          }
          add_marker(property)
        } else {
          error_count += 1
        }
      })
      console.log("There were " + error_count + " listings missing `address_object`")
    }
    else {
      console.log("No listings to update")
    }
}

function extractData(data, var1, var2) {
	var pdata = {x: [], y: []}
	for (var d in data) {
		var property = data[d]
    if (property != null) {
  		x = property[var1]
  		y = property[var2]
      if (x != undefined && y != undefined) {
        pdata['x'].push(x)
        pdata['y'].push(y)        
      }
    }
	}
	return pdata
}

function aggregateData(data, var1, var2) {
  counter = {}
  $.each(data, function(i, elem) {
    val1 = elem[var1]
    val2 = elem[var2]
    c = counter[val1]
    if (c == undefined) {
      c = {}
      counter[val1] = c
    }
    if (c[val2] == undefined) {
      c[val2] = 1
    } else {
      c[val2] = c[val2] + 1
    }
  })
  var agg = []
  var rows = Object.keys(counter)
  $.each(rows, function(r, key) {
    cols = counter[key]
    $.each(cols, function(c, count) {
      var line = {"r": key, "c": c, "count": count}
      agg.push(line)
    })
  })
  return agg
}

function showWaiting() {
  $("#errorBox").hide()
  $(".wait-spinner").show()
	$(".plotCell").html("<img src='box.gif' />")
}

onchange = function() {
  showWaiting()
  render()
}

var map = null
var sliders = {}

$( document ).ready(function() {
  max_price=10000000
  min_price=  100000
  max_sqft=10000

  $("#btnSearch").click(function() {
    showWaiting()
    render()
  })

  sliders['bed'] = slider("#slide_bed", -1, 6, [1, 3], "Beds: ")
  sliders['bath'] = slider("#slide_bath", -1, 4, [1, 2], "Baths: ")
  sliders['price'] = slider("#slide_price", -1, max_price, [min_price, max_price], "Price: ")
  sliders['sqft'] = slider("#slide_sqft", -1, max_sqft, [-1, max_sqft], "SQ.FT.: ")

  mapInit('map', 'info', [], 39.50, -98.35, 4)

  new Clipboard('#btnCopy');

	showWaiting()
	render()
  $("#tabs").tabs({
      activate: function (event, ui) {
          var active = $('#tabs').tabs('option', 'active');
      }
  });
});


