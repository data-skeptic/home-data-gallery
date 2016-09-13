var distance = function(a, b){
  return Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2);
}

function haversineDistance(a, b, isMiles=1) {
  function toRad(x) {
    return x * Math.PI / 180;
  }
  var lon1 = a['latitude']
  if (lon1 == undefined)
    lon1 = a['address_object']['latitude']
  var lat1 = a['longitude']
  if (lat1 == undefined)
    lat1 = a['address_object']['latitude']
  var lon2 = b['latitude']
  if (lon2 == undefined)
    lon2 = a['address_object']['latitude']
  var lat2 = b['longitude']
  if (lat2 == undefined)
    lat2 = a['address_object']['latitude']
  var R = 6371; // km
  var x1 = lat2 - lat1;
  var dLat = toRad(x1);
  var x2 = lon2 - lon1;
  var dLon = toRad(x2)
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  if(isMiles) d /= 1.60934;
  return d;
}

var tree = new kdTree([], haversineDistance, ["latitude", "longitude"])

keys = Object.keys(localStorage)
$.each(keys, function(i, key) {
  str = localStorage.getItem(key)
  elem = JSON.parse(str)
  if (elem['latitude'] != undefined && elem['longitude'] != undefined) {
    tree.insert(elem)
  }
})

var er = null

// call by doSearch() in code.js
function writeLocalStorage(response) {
  data = response['results']
  if (data.length > 0) {
    $.each(data, function(i, elem) {
      if (elem['address_object'] != undefined) {
        var toCache = {}
        toCache['id'] = elem['id']
        toCache['address_object'] = elem['address_object']
        toCache['bedrooms'] = elem['bedrooms']
        toCache['bathrooms'] = elem['bathrooms']
        toCache['building_size'] = elem['building_size']
        toCache['car_spaces'] = elem['car_spaces']
        toCache['listing_type'] = elem['listing_type']
        toCache['price'] = elem['price']
        toCache['size_units'] = elem['size_units']
        toCache['latitude'] = elem['address_object']['latitude']
        toCache['longitude'] = elem['address_object']['longitude']

        // Save data element to cache by element id
        point = {"latitude": toCache['latitude'], "longitude": toCache['longitude']}
        dupes = tree.nearest(point, 9999, 1)
        $.each(dupes, function(i, dwrap) {
          dupe = dwrap[0]
          if (dupe['id'] == elem['id']) {
            tree.remove(dupe)
          }
        })
        tree.insert(toCache)

        // Save element to `localStore` to be more persistent
        try {
          localStorage.setItem(elem['id'], JSON.stringify(toCache))
        } catch (err) {
          if (err.name == "QuotaExceededError") {
            //console.log("Quota issue")
            // TODO: handle it better
          } else {
            console.log(err)
          }
        }
      }
    })
  }
}

// get data from LocalStorage
// need to be able to filter etc
function readLocalStorage(id) {
  elem = localStorage.getItem(id)
  if (elem != undefined) {
    elem = JSON.parse(elem)
  }
  return elem
}

function clearLocalStorage() {
  tree = new kdTree([], haversineDistance, ["latitude", "longitude"])
  localStorage.clear()
}

function isInside(lat, lon, bbox) {
  if (lat == null || lon == null) {
    return false
  }
  var lat1 = bbox.top
  var lon1 = bbox.left
  var lat2 = bbox.bottom
  var lon2 = bbox.right
  if (lat2 <= lat && lat <= lat1) {
    if (lon1 <= lon && lon <= lon2) {
      return true
    }
  }
  return false
}

function readPropertiesFromLocalStorage(viewport, filters) {
  var lat1 = bbox.top
  var lon1 = bbox.left
  var lat2 = bbox.bottom
  var lon2 = bbox.right
  var clat = (lat1 - lat2)/2 + lat2
  var clon = (lon1 - lon2)/2 + lon2

  radius_miles = haversine_distance(clat, clon, lat2, lon2)
  // TODO: revisit this 9999
  kdmatches = tree.nearest({"latitude": clat, "longitude": clon}, 9999, radius_miles)

  cmatches = []
  $.each(kdmatches, function(i, match) {
    match = match[0] // trim off distance value
    // Trim radius result down to viewport
    if (isInside(match['latitude'], match['longitude'], bbox)) {
      cmatches.push(match)
    }
  })

  matches = []
  filterAttributes = Object.keys(filters)
  $.each(cmatches, function(i, cmatch) {
    var filterMatch = true
    $.each(filterAttributes, function(i, kkey) {
      var valid_key = true
      var min = true
      if (kkey.startsWith('min_')) {
        key = kkey.substring(4, kkey.length)
      }
      else if (kkey.startsWith('max_')) {
        key = kkey.substring(4, kkey.length)
        min = false
      }
      else {
        valid_key = false
      }
      if (valid_key) {
        val = cmatch[key]
        if (val == undefined) {
          filterMatch = false
        }
        else {
          if (min) {
            if (val < filters[kkey]) {
              filterMatch = false
            }
          } else {
            if (val > filters[kkey]) {
              filterMatch = false
            }
          }
        }        
      }
    })
    if (filterMatch) {
      matches.push(cmatch)
    }
  })
  return matches
}

// not TESTed
// function mergeRESTWithLocal() {
//   // How to parse reqest to localStorage search?
//   var localData = readLocalStorage();
//   var promise = Promise.resolve(callREST());
//   promise.resolve(function (data) => localData ++ parseData(data))
//   // Update plot
//   $(".wait-spinner").hide()
//   updateTable(localData) // updateTable.js
//   updateMap(localData)
//   makePlots(localData)
//   writeLocalStorage(localData) // localStorageIO.js
// }