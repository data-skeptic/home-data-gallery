export default class {
	constructor(local_storage_version) {
		this.validate(local_storage_version)
		localStorage.setItem("local_storage_version", local_storage_version)
		this.local_storage_size = 10000
		this.listings_dict = {}
	}

	validate(local_storage_version) {
		var version = localStorage.getItem("local_storage_version")
		if (version == undefined) {
			// In case something is there but version is missing
			console.log("No localStorage")
			localStorage.clear()
			return
		}
		if (version != local_storage_version) {
			console.log("Clearing localStorage")
			localStorage.clear()
		}
	}

	getPersistentState() {
		var state = {}
		try {
			var sc = localStorage.getItem("searchCriteria")
			var p = localStorage.getItem("position")
			var s = localStorage.getItem("zoom")
			if (sc != undefined) {
				state.searchCriteria = JSON.parse(sc)
			}
			if (p != undefined) {
				state.position = JSON.parse(p)
			}
			if (s != undefined) {
				state.zoom = JSON.parse(s)
			}
		} catch (err) {
			console.log(["err", err])
		}
		return state
	}

	savePersistentState(state) {
		localStorage.setItem("searchCriteria", JSON.stringify(state.searchCriteria))
		localStorage.setItem("position", JSON.stringify(state.position))
		localStorage.setItem("zoom", JSON.stringify(state.zoom))
	}

	update_and_cache(resp, search_criteria, bounds) {
		var update = this.update_local_cache(search_criteria, bounds)
		var invisibles = update['invisible']

		// Do we need to clear the cache any?
		var data = resp['results']
		var n = update['visible'].length
		var m = data.length
		var overage = this.local_storage_size - n - m
		var i = 0
		while (i < invisibles.length && overage > 0) {
			var listing_id = invisibles[i]
			var listing = this.listings_dict[listing_id]
			if (!listing.visible) {
				delete this.listings_dict[listing_id]
				overage -= 1
			}
			i += 1
		}
		// loop over new, validate, insert
		for (var i=0; i < data.length; i++) {
			var listing = data[i]
			var listing_id = listing['id']
			var visible = true
			if (bounds == undefined) {
				visible = true
			} else if (!this.inBounds(listing, bounds)) {
				visible = false
			}
			if (!this.meetsCriteria(listing, search_criteria)) {
				visible = false
				console.log("wrong crit")
			}
			listing['visible'] = visible
			this.listings_dict[listing_id] = listing
		}
		var listing_ids = Object.keys(this.listings_dict)
		var listings = []
		for (var i=0; i < listing_ids.length; i++) {
			var listing_id = listing_ids[i]
			var listing = this.listings_dict[listing_id]
			if (listing.visible) {
				listings.push(listing)
			}
		}
		return listings
	}

	isBetween(x, a, b) {
		if (a <= x && x <= b)
			return true
		if (b <= x && x <= a)
			return true
		return false
	}

	inBounds(listing, bbox) {
		var lat = null
		var lon = null
		var ao = listing.address_object
		if (ao != undefined) {
			lat = ao.latitude
			lon = ao.longitude
		}
		if (lat == null || lon == null) {
			return false
		}
		var lat1 = bbox.left
		var lon1 = bbox.bottom
		var lat2 = bbox.right
		var lon2 = bbox.top
		var a = this.isBetween(lat, lat1, lat2)
		var b = this.isBetween(lon, lon1, lon2)
		if (a && b) {
			return true
		}
		return false
	}

	meetsCriteria(listing, search_criteria) {
		var price = listing.price
		var bedrooms = listing.bedrooms
		var bathrooms = listing.bathrooms
		var sqft = listing.building_size
		if (!this.isBetween(price, search_criteria.price[0], search_criteria.price[1])) {
			return false
		}
		if (!this.isBetween(bedrooms, search_criteria.bathrooms[0], search_criteria.bedrooms[1])) {
			return false
		}
		if (!this.isBetween(bathrooms, search_criteria.bedrooms[0], search_criteria.bathrooms[1])) {
			return false
		}
		if (!this.isBetween(sqft, search_criteria.sqft[0], search_criteria.sqft[1])) {
			return false
		}
		return true
	}

	update_local_cache(searchCriteria, bounds) {
		// loop over dict, update by criteria and bounds
		var listing_ids = Object.keys(this.listings_dict)
		var visible = []
		var invisible = []
		for (var i=0; i < listing_ids.length; i++) {
			var listing_id = listing_ids[i]
			var listing = this.listings_dict[listing_id]
			var v = true
			if (bounds == undefined) {
				v = true
			} else if (!this.inBounds(listing, bounds)) {
				v = false
			}
			if (!this.meetsCriteria(listing, searchCriteria)) {
				v = false
			}
			listing['visible'] = v
			this.listings_dict[listing_id] = listing
			if (v) {
				visible.push(listing)
			} else {
				invisible.push(listing_id)
			}
		}
		var update = {visible, invisible}
		return update
	}

}