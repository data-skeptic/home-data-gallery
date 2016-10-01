var baseurl = "http://api.openhouseproject.co"  // Location of the API
var save_var_name = "oh-state"                  // Name of variable for local cache
var map = null                                  // global reference to the map
var sliders = {}                                // dictionary of all slider UI elements
var state = {}                                  // Current search filters and other state info

var api = ApiConnectorSingleton.getInstance()

/*
  This function checks if the visitor has any local storage.
  If so, it is loaded.  If not, a record is created.
*/
function load_state() {
  var pstate = localStorage.getItem(save_var_name);
  if (pstate == null) {
    console.log("Fresh state")
    state['min_price']        = 100000
    state['max_price']        = 10000000
    state['min_sqft']         = 0
    state['max_sqft']         = 10000
    state['address']          = ""
    state['map']              = {}
    state['map']['zoom']      = 4
    state['map']['latitude']  = 39.50
    state['map']['longitude'] = -98.35
    save_state()
  }
  else {
    console.log("Loading state")
    state = JSON.parse(pstate)
    if (state['map'] == undefined) {
      state['map']              = {}
      state['map']['zoom']      = 4
      state['map']['latitude']  = 39.50
      state['map']['longitude'] = -98.35      
    }
    // Check for missing values (could happen if someone has a state from an earlier version)
    // Set intelligent defaults for any missing values
    if (state['min_price'] == undefined) state['min_price'] = 100000
    if (state['max_price'] == undefined) state['max_price'] = 10000000
    if (state['min_sqft'] == undefined) state['min_sqft'] = 0
    if (state['max_sqft'] == undefined) state['max_sqft'] = 10000
    if (state['address'] == undefined) state['address'] = ""
    // TODO: set filter defaults from state (sliders)
  }
}

/*
  Whenever any change to the state is made, this is called to save it
*/
function save_state() {
    localStorage.setItem(save_var_name, JSON.stringify(state))
}

/*
  When the site is doing operations in the background, this function
  updates the user interface to make it clear we are still waiting.
*/
function show_waiting() {
  $("#errorBox").hide()
  $(".wait-spinner").show()
  $(".plotCell").html("<img src='box.gif' />")
}

/*
  When the user asks for data to be refreshed, this function is called
*/
function doSearch() {
  show_waiting()
  request = get_request()
  api.setRequest(request)
  murl = update_curl_req(request)
  api.callApi()
}


/*
  One UI element reports statistics of listings currently shown on the
  active viewport of the map.  If the map has been moved, that element
  needs to be updated, and this initializes a data structure that will
  store all the statistics.
*/
function default_stats() {
  var zeros = {'min': 0, 'max': 0, 'mean': 0, 'stdev': 0, 'median': 0}
  return {'beds': zeros, 'baths': zeros, 'price': zeros, 'sqft': zeros}
}

/*
  When the page is ready to be loaded, configure everything
*/
$(document).ready(function() {
  load_state()

  var response = null
  var stats = default_stats()

  // This is the search button that's part of the header
  $("#btnSearch").click(doSearch)

  // Initialize the sliders in the header
  sliders['bed'] = slider("#slide_bed", -1, 11, [1, 3], "Beds: ")
  sliders['bath'] = slider("#slide_bath", -1, 8, [1, 2], "Baths: ")
  sliders['price'] = slider("#slide_price", -1, state['max_price'], [state['min_price'], state['max_price']], "Price: ")
  sliders['sqft'] = slider("#slide_sqft", -1, state['max_sqft'], [state['min_sqft'], state['max_sqft']], "SQ.FT.: ")

  $("#address").val(state['address'])
  $("#location_div").hide()

  /*
    Configure the map
  */
  ev = {
      eventListeners: {
          "moveend": mapEvent,
          "zoomend": mapEvent,
          "changelayer": mapLayerChanged,
          "changebaselayer": mapBaseLayerChanged
      }
    }  
  map = mapInit('map', 'info', [], state['map']['latitude'], state['map']['longitude'], state['map']['zoom'], ev)

  // Configure clipboard interactions for the curl->clipboard box
  new Clipboard('#btnCopy');

  // Configure tabs
  $("#tabs").tabs({
      activate: function (event, ui) {
          var active = $('#tabs').tabs('option', 'active');
      }
  });

  // Configure an update when any slider is changed
  $.each(sliders, function(i, slider) {
    slider.noUiSlider.on('update', function( values, handle ) {
      $(".wait-spinner").show()
      request = get_request()
      api.setRequest(request)
      update_curl_req(request)
    })
  })

  // Configure an update when the address box is changed
  $("#address").change(function() {
      request = get_request()
      api.setRequest(request)
      update_curl_req(request)
  })

  request = get_request()
  api.setFilters(request)
  setInterval(function() {api.callApi()}, 1000)

  var bounds = map.getExtent().clone()
  bbox = bounds.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"))
  filters = get_request()
  results = readPropertiesFromLocalStorage(bbox, filters)
  updateMap(results)
  updateTable(results) // updateTable.js
  makePlots(results)

  // Do initial search
  doSearch()
});

/*
  Checks to see if the text in the #address box consists of the formal for a radius search
*/
function isRadius(s) {
  if (s.split(",").length!=3) return false;
  if (s.substring(0,1)!="(") return false;
  if (s.substring(s.length-1, s.length)!=")") return false;
  return true;
}

/*
  Accept an array of properties visible in the map's viewport
  Return summary statistics of those properties
*/
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

/*
  Generate a request object based on all the UI filters
*/
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

  request = {'min_price': state['min_price'],
      'max_price': state['max_price'],
      'min_bedrooms': state['min_beds'],
      'max_bedrooms': state['max_beds'],
      'min_bathrooms': state['min_baths'],
      'max_bathrooms': state['max_baths'],
      'min_building_size': state['min_sqft'],
      'max_building_size': state['max_sqft']
  }

  return request
}

/*
  Given a request object, convert it into a corresponding CURL request.  This
  request is not used, but is provided to the user in the UI in case they'd like
  a handy way to grab the data shown.
*/
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
    // This save the request URL??
    save_state()
  }
  $("#curl").val('curl -X GET "' + murl + '"')
  return murl
}

/*
  Populate the "Analysis" tab, which has a scatter matrix of values
*/
function makePlots(homes) {
  var dims = ['price', 'bathrooms', 'bedrooms', 'building_size']
  var cells = ['Price', 'Beds', 'Baths', 'Sqft']
  if (homes.length == 0) {
    $(".plotCell").html("")
    $("#errorBox").html("Your search result did not return any properties.")
    $("#errorBox").show()
  }
  else {
    $("#errorBox").hide()
    var w = 200
    var h = 200
    for (var r=0; r < dims.length; r++) {
      for (var c=r; c < dims.length; c++) {
        var container = cells[r] + 'V' + cells[c]
        xy = extractData(homes, dims[r], dims[c])
        if (r==c) {
          histogram("#" + container, xy['x'], w, h)
        } else if (dims[r] == 'bathrooms' && dims[c] == 'bedrooms' || dims[c] == 'bathrooms' && dims[r] == 'bedrooms') {
          agg = aggregateData(homes, dims[r], dims[c])
          heatmap("#" + container, agg)
        } else {
          scatterplot('#' + container, xy, w, h)
        }
      }
    }    
  }
}

/*
  Helper function that makes it easier to take the API's response and format it
  conveniently for the D3 visualizations to use
*/
function extractData(homes, var1, var2) {
  var pdata = {x: [], y: []}
  for (var d in homes) {
    var property = homes[d]
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

/*
  Given a list of properties (data), update the map and 
  apply filters such as minimum number of bedrooms
*/
function updateMap(data) {
    var bounds = map.getExtent().clone()
    var bounds = map.getExtent().clone()
    bbox = bounds.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"))
    filters = get_request()
    data = readPropertiesFromLocalStorage(bbox, filters)
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
        var lat = 0
        var lon = 0
        if (ao != null) {
          address = ao['formatted_address']
          lat = ao['latitude']
          lon = ao['longitude']
        } else if (elem['latitude'] != undefined) {
          lat = elem['latitude']
          lon = elem['longitude']
        } else {
          error_count += 1
        }
        property = {
          "address": address,
          "sale_price": price,
          "bedrooms": bed,
          "bathrooms": bath,
          "latitude": lat,
          "longitude": lon
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
      if (error_count > 0) {
        console.log("There were " + error_count + " listings missing `address_object`")
      }
    }
    else {
      console.log("No listings to update")
    }
    update_summary('summary')
}

// Helper function
function formatNumber(n) {
  return Math.round(n * 100)/100
}

/*
  Render the summary box to the right of the map
*/
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

/*
  A helper function thate takes the data returned from the API and aggregates it
  for use in the "Analysis" tab visualizations
*/
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

/*
  A helper function that checks if val is beteen bound1 and bound2
*/
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

/*
  Determine if the map should be updated
*/
function updateMapAfterViewportChange() {
  start = new Date().getTime()
  var bounds = map.getExtent().clone()
  bbox = bounds.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"))

  lat = map.getCenter()['lat']
  lon = map.getCenter()['lon']
  var mapnik         = new OpenLayers.Layer.OSM();
  var toProjection   = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
  var fromProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
  var position       = new OpenLayers.LonLat(lon, lat).transform( fromProjection, toProjection)
  state['map']              = {}
  state['map']['zoom']      = map.getZoom()
  state['map']['latitude']  = position['lat']
  state['map']['longitude'] = position['lon']
  save_state()

  var bounds = map.getExtent().clone()
  bbox = bounds.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"))
  filters = get_request()
  results = readPropertiesFromLocalStorage(bbox, filters)
  updateMap(results)
  updateTable(results) // updateTable.js
  makePlots(results)

  request = get_request()
  api.setRequest(request)
  update_curl_req(request)
  save_state()
  end = new Date().getTime()
  console.log('updateMapAfterViewportChange took' + (end - start).toString())
}

/*
  Call this function when an map event has occured
*/
function mapEvent(event) {
  et = event.type
  if (et=="zoomend" || et=="moveend") {
    $(".wait-spinner").show()
    updateMapAfterViewportChange()
  } else {
    // Perhaps in the future we will handle other events too
  }
}

/*
  These next two function are not used.  They are added to cover events
  we might want to respond to in the future.
*/
function mapBaseLayerChanged(event) {
  console.log(event.type + " " + event.layer.name);
}
function mapLayerChanged(event) {
  console.log(event.type + " " + event.layer.name + " " + event.property);
}




