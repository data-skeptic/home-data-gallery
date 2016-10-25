export default class {
	constructor() {
		this.tree = new kdTree([], this.haversineDistance, ["latitude", "longitude"])
		var keys = Object.keys(localStorage)
		var cacheSize = 0
		for (var i=0; i < keys.length; i++) {
			var key = keys[i]
			var str = localStorage.getItem(key)
			var elem = JSON.parse(str)
			if (elem['address_object']) {
				elem['latitude'] = elem['address_object']['latitude']
				elem['longitude'] = elem['address_object']['longitude']
				this.tree.insert(elem)
				cacheSize += 1
			}
		}
		console.log("Cache size: " + cacheSize)
	}

	readLocalStorage(id) {
		var elem = localStorage.getItem(id)
		if (elem != undefined) {
			elem = JSON.parse(elem)
		}
		return elem
	}

	clearLocalStorage() {
		this.tree = new kdTree([], this.haversineDistance, ["latitude", "longitude"])
		localStorage.clear()
	}

	distance(a, b) {
	  return Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2);
	}

	haversineDistance(p1, p2, isMiles=1) {
		function toRad(x) {
			return x * Math.PI / 180;
		}
		var lat1 = p1['latitude']
		if (lat1 == undefined && p1['address_object'] != undefined)
			lat1 = p1['address_object']['latitude']
		var lon1 = p1['longitude']
		if (lon1 == undefined && p1['address_object'] != undefined)
			lon1 = p1['address_object']['longitude']

		if (lat1 == undefined || lon1 == undefined) {
			return 99999999
		}

		var lat2 = p2['latitude']
		if (lat2 == undefined && p2['address_object'] != undefined)
			lat2 = p2['address_object']['latitude']
		var lon2 = p2['longitude']
		if (lon2 == undefined && p2['address_object'] != undefined)
			lon2 = p2['address_object']['longitude']

		if (lat2 == undefined || lon2 == undefined) {
			return 99999999
		}

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

	isInside(lat, lon, bbox) {
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

	readPropertiesFromLocalStorage(viewport, filters) {
		var lat1 = viewport.top
		var lon1 = viewport.left
		var lat2 = viewport.bottom
		var lon2 = viewport.right
		var clat = (lat1 - lat2)/2 + lat2
		var clon = (lon1 - lon2)/2 + lon2
		var radius_miles = this.haversineDistance({"latitude": clat, "longitude": clon}, {"latitude": lat2, "longitude": lon2})
		// TODO: revisit this 500
		var kdmatches = this.tree.nearest({"latitude": clat, "longitude": clon}, 500, radius_miles)

		var cmatches = []
		for (var i=0; i < kdmatches.length; i++) {
			var match = kdmatches[i][0]
			// Trim radius result down to viewport
			if (this.isInside(match['latitude'], match['longitude'], viewport)) {
				cmatches.push(match)
			}
		}

		var matches = []
		var filterAttributes = Object.keys(filters)
		for (var i=0; i < cmatches.length; i++) {
			var cmatch = cmatches[i]
			var filterMatch = true
			for (var j=0; j < filterAttributes.length; j++) {
				var kkey = filterAttributes[j]
				var valid_key = true
				var min = true
				var key = ''
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
					var val = cmatch[key]
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
			}
			if (filterMatch) {
				matches.push(cmatch)
			}
		}
		return matches
	}

	writeLocalStorage(response) {
		var data = response['results']
		if (data.length > 0) {
			for (var i=0; i < data.length; i++) {
		  		var elem = data[i]
				if (elem['address_object'] != undefined) {
			        var toCache = elem
			        toCache["latitude"] = toCache['address_object']['latitude']
			        toCache["longitude"] = toCache['address_object']['longitude']

			        // Save data element to cache by element id
			        var point = {"latitude": toCache['address_object']['latitude'], "longitude": toCache['address_object']['longitude']}
			        var dupes = this.tree.nearest(point, 9999, 1)
			        for (var j=0; j < dupes.length; j++) {
			        	var dwrap = dupes[j]
						var dupe = dwrap[0]
						if (dupe['id'] == elem['id']) {
			            	this.tree.remove(dupe)
				        }
			        }
			        this.tree.insert(toCache)

			        // Save element to `localStore` to be more persistent
			        try {
			         	localStorage.setItem(elem['id'], JSON.stringify(toCache))
			        } catch (err) {
			        	if (err.name == "QuotaExceededError") {
			            	console.log("Quota issue")
			        		// TODO: handle it better
			          	} else {
			            	console.log(err)
			          	}
			        }
			    }
		    }
		}
	}
}