var baseurl = "http://api.openhouseproject.co"

var save_var_name = "oh-state"

function isRadius(s) {
  if (s.split(",").length!=3) return false;
  if (s.substring(0,1)!="(") return false;
  if (s.substring(s.length-1, s.length)!=")") return false;
  return true;
}

function default_stats() {
  var zeros = {'min': 0, 'max': 0, 'mean': 0, 'stdev': 0, 'median': 0}
  return {'beds': zeros, 'baths': zeros, 'price': zeros, 'sqft': zeros}
}

function get_stats(arr) {
  var stats = {
      'min': math.min(arr)
    , 'max': math.max(arr)
    , 'mean': math.mean(arr)
    , 'median': math.median(arr)
    , 'std': math.std(arr)
  }
  return stats
}

function get_request() {
  svals = sliders['price'].noUiSlider.get()
  state['min_price'] = parseFloat(svals[0])
  state['max_price'] = parseFloat(svals[1])
  svals = sliders['bed'].noUiSlider.get()
  state['min_beds'] = parseFloat(svals[0])
  state['max_beds'] = parseFloat(svals[1])
  svals = sliders['bath'].noUiSlider.get()
  state['min_baths'] = parseFloat(svals[0])
  state['max_baths'] = parseFloat(svals[1])
  svals = sliders['sqft'].noUiSlider.get()
  state['min_sqft'] = parseFloat(svals[0])
  state['max_sqft'] = parseFloat(svals[1])
  svals = sliders['price'].noUiSlider.get()
  address = $("#address").val()
  address = address.trim()

  request = {'min_price': state['min_price'],
      'max_price': state['max_price'],
      'min_bedrooms': state['min_beds'],
      'max_bedrooms': state['max_beds'],
      'min_bathrooms': state['min_baths'],
      'max_bathrooms': state['max_baths'],
      'min_building_size': state['min_sqft'],
      'max_building_size': state['max_sqft'],
      'limit': '500',
      'offset': '0'
  }
  if (isRadius(address)) {
    request['close_to'] = address
  } else {
    request['address'] = address
  }
  return request
}

function update_curl_req(request) {
  var murl = baseurl + '/api/property/?'
  var keys = Object.keys(request)
  for (var i in keys) {
    var item = keys[i]
    if (i > 0) {
      murl += "&"
    }
    murl += item + "=" + request[item]
    console.log("saving state")
    localStorage.setItem(save_var_name, JSON.stringify(state))
  }
  $("#curl").val('curl -X GET "' + murl + '"')
  return murl
}

function render() {
  request = get_request()
  murl = update_curl_req(request)

  $.ajax({
  	url: murl,
  	type: 'GET',
  	contentType: 'text/json',
  	dataType: 'json',
  	success: function(resp) {
      response = resp
      $(".wait-spinner").hide()
      updateTable(resp)
      updateMap(resp['results'])
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

function updateMap(data) {
    remove_all_markers()
    stats = default_stats()

    if (data.length > 0) {
      beds = []
      baths = []
      sqfts = []
      prices = []
      var latlngs = []
      var error_count = 0
      $.each(data, function(i, elem) {
        var ao = elem['address_object']
        var bed = elem['bedrooms']
        var bath = elem['bathrooms']
        var price = elem['price']
        var sqft = elem['building_size']
        if (ao != null) {
          property = {
            "address": ao['formatted_address'],
            "sale_price": price,
            "bedrooms": bed,
            "bathrooms": bath,
            "latitude": ao['latitude'],
            "longitude": ao['longitude']
          }
          add_marker(property)
          if (bed >= 0) {
            beds.push(bed)
          }
          if (bath >= 0) {
            baths.push(bath)
          }
          if (price >= 0) {
            prices.push(price)
          }
          if (sqft >= 0) {
            sqfts.push(sqft)
          }
        } else {
          error_count += 1
        }
      })
      if (beds.length > 0) {
        stats['beds'] = get_stats(beds)
      }
      if (baths.length > 0) {
        stats['baths'] = get_stats(baths)
      }
      if (prices.length > 0) {
        stats['price'] = get_stats(prices)
      }
      if (sqfts.length > 0) {
        stats['sqft'] = get_stats(sqfts)
      }
      console.log("There were " + error_count + " listings missing `address_object`")
    }
    else {
      console.log("No listings to update")
    }
    update_summary('summary')
}

function formatNumber(n) {
  return Math.round(n * 100)/100
}

function update_summary(container) {
  var bdy = `
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Mean</th>
          <th>Median</th>
        </tr>
      </thead>
      <tbody>
      `
  var arr = ['price', 'beds', 'baths', 'sqft']
  $.each(arr, function(i, m) {
    bdy += `
        <tr>
          <td>` + m + `</td>
          <td>` + formatNumber(stats[m]['mean']) + `</td>
          <td>` + formatNumber(stats[m]['median']) + `</td>
        </tr>
    `
  })
  bdy += `
      </tbody>
    </table>
  `
  $("#" + container).html(bdy)
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
  $("#searchAgain").hide()
  $(".wait-spinner").show()
	$(".plotCell").html("<img src='box.gif' />")
}

function load_state() {
  var pstate = localStorage.getItem(save_var_name);
  if (pstate == null) {
    console.log("Fresh state")
    state['min_price'] = 100000
    state['max_price'] = 10000000
    state['min_sqft']  = 0
    state['max_sqft']  = 10000
    state['address']   = ""
    localStorage.setItem(save_var_name, JSON.stringify(state))
  }
  else {
    console.log("Loading state")
    state = JSON.parse(pstate)
  }
}


var map = null
var sliders = {}
var state = {}

function between(val, bound1, bound2) {
  if (bound2 < bound1) {
    swap = bound1
    bound1 = bound2
    bound2 = swap
  }
  if (val >= bound1) {
    if (val <= bound2) {
      return true
    }
  }
  return false
}

function considerMapUpdate() {
  $("#searchAgain").show()
  var inbounds = []
  if (window['response'] != undefined) {
    var bounds = map.getExtent().clone()
    bbox = bounds.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"))
    $.each(response['results'], function(i, result) {
      ao = result['address_object']
      if (ao != undefined) {
        if (between(ao['latitude'], bbox.bottom, bbox.top)) {
          if (between(ao['longitude'], bbox.left, bbox.right)) {
            inbounds.push(result)
          }
        }
      }
    })
    updateMap(inbounds)
  }
}

function mapEvent(event) {
  et = event.type
  if (et=="zoomend" || et=="moveend") {
    considerMapUpdate()
  } else {
    console.log(event.type)    
  }
}
function mapBaseLayerChanged(event) {
  console.log(event.type + " " + event.layer.name);
}
function mapLayerChanged(event) {
  console.log(event.type + " " + event.layer.name + " " + event.property);
}

function doSearch() {
  showWaiting()
  render()
}

$( document ).ready(function() {
  load_state()

  var response = null
  var stats = default_stats()

  $("#btnSearch").click(doSearch)
  $("#btnSearchYes").click(function() {
    var bounds = map.getExtent().clone()
    bbox = bounds.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"))
    clon = (bbox.top - bbox.bottom)/2 + bbox.bottom
    clat = (bbox.left - bbox.right)/2 + bbox.right

    var lat2 = bbox.left
    var lon2 = bbox.top

    miles = haversine_distance(clat, clon, lat2, lon2)

    searchBounds = "(" + Math.round(miles) + "," + clon.toFixed(3) + "," + clat.toFixed(3) + ")"
    $("#address").val(searchBounds)
    doSearch()
  })
  $("#btnSearchNo").click(function() {
    $("#searchAgain").hide()
  })

  sliders['bed'] = slider("#slide_bed", -1, 6, [1, 3], "Beds: ")
  sliders['bath'] = slider("#slide_bath", -1, 4, [1, 2], "Baths: ")
  sliders['price'] = slider("#slide_price", -1, state['max_price'], [state['min_price'], state['max_price']], "Price: ")
  sliders['sqft'] = slider("#slide_sqft", -1, state['max_sqft'], [state['min_sqft'], state['max_sqft']], "SQ.FT.: ")

  $("#address").val(state['address'])

  ev = {
      eventListeners: {
          "moveend": mapEvent,
          "zoomend": mapEvent,
          "changelayer": mapLayerChanged,
          "changebaselayer": mapBaseLayerChanged
      }
    }
  
  map = mapInit('map', 'info', [], 39.50, -98.35, 4, ev)

  $("#searchAgain").hide()

  new Clipboard('#btnCopy');

	showWaiting()
	render()
  $("#tabs").tabs({
      activate: function (event, ui) {
          var active = $('#tabs').tabs('option', 'active');
      }
  });
  $.each(sliders, function(i, slider) {
    slider.noUiSlider.on('update', function( values, handle ) {
      update_curl_req(get_request())
    })
  })
  $("#address").change(function() {
    update_curl_req(get_request())
  })
});


