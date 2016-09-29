var id_counter = 0

function sample_record(lat, lng) {
	elem = {}
	id_counter += 1
	elem['id'] = id_counter.toString()
	elem['address_object'] = {"formatted_address": "my address", "latitude": lat, "longitude": lng}
	elem['bedrooms'] = 2
	elem['bathrooms'] = 1
	elem['building_size'] = 1000
	elem['car_spaces'] = 0
	elem['listing_type'] = 'S'
	elem['price'] = 100000
	elem['size_units'] = 2
	return elem
}

function isEqual(e1, e2) {
	if (e1 == undefined && e2 == undefined) {
		return true
	}
	if (e1 == undefined || e2 == undefined) {
		return false
	}
	if (Object.keys(e1).length != Object.keys(e2).length) {
		return false
	}
	keys = Object.keys(e1)
	for (i=0; i < keys.length; i++) {
		key = keys[i]
		if (!(key in e2)) {
			return false
		}
		v1 = e1[key]
		v2 = e2[key]
		if (v1 != v2) {
			return false
		}
	}
	return true
}

function kd_tree_test() {
	clearLocalStorage()
	var points = [
	  {x: 1, y: 2},
	  {x: 3, y: 4},
	  {x: 5, y: 6},
	  {x: 7, y: 8}
	];
	var distance = function(a, b){
	  return Math.pow(a.x - b.x, 2) +  Math.pow(a.y - b.y, 2);
	}
	var tree = new kdTree(points, distance, ["x", "y"]);
	var nearest = tree.nearest({ x: 5, y: 5 }, 2);
	if (nearest[0][0]['x'] != 3) return false
	if (nearest[0][0]['y'] != 4) return false
	if (nearest[0][1] != 5) return false
	if (nearest[1][0]['x'] != 5) return false
	if (nearest[1][0]['y'] != 6) return false
	if (nearest[1][1] != 1) return false
	return true
}

function update_on_duplicate_test() {
	clearLocalStorage()
	lat = 0
	lng = 0
	e1 = sample_record(lat, lng)
	e2 = sample_record(lat, lng)
	e2['id'] = e1['id']
	writeLocalStorage({'results': [e1, e2]})
	t1 = readPropertiesFromLocalStorage(lat, lng, 0, {})
	console.log(t1.length)
	if (t1.length != 1) {
		return false
	}
	e3 = sample_record(lat, lng)
	e3['id'] = e1['id']
	e3['bedrooms'] = 99
	writeLocalStorage({'results': [e3]})
	t2 = readPropertiesFromLocalStorage(lat, lng, 0, {})
	if (t2.length != 1) {
		return false
	}
	if (t2[0][0]['bedrooms'] != 99) {
		return false
	}
	return true
}

function write_and_recall_test() {
	clearLocalStorage()
	elem = sample_record(0, 0)
	writeLocalStorage({'results': [elem]})
	e2 = readLocalStorage(elem['id'])
	return isEqual(elem, e2)
}

function radius_search_test() {
	clearLocalStorage()
	lat = 1
	lng = 2
	elem1 = sample_record(lat, lng)
	elem2 = sample_record(lat, lng)
	writeLocalStorage({'results': [elem1, elem2]})
	radius = 10
	filters = {}
	matches = readPropertiesFromLocalStorage(lat, lng, radius, filters)
	if (matches.length != 2) {
		return false
	}
	matches = readPropertiesFromLocalStorage(lat + 2 * radius, lng, radius, filters)
	if (matches.length != 0) {
		return false
	}
	return true
}

function search_with_filters() {
	lat = 1
	lng = 2
	elem1 = sample_record(lat, lng)
	elem2 = sample_record(lat, lng)
	elem2['bedrooms'] = 3
	writeLocalStorage({'results': [elem1, elem2]})
	radius = 10
	filters = {'bedrooms': 1}
	matches = readPropertiesFromLocalStorage(lat, lng, radius, filters)
	if (matches.length != 0) {
		return false
	}
	filters = {'bedrooms': 2}
	matches = readPropertiesFromLocalStorage(lat, lng, radius, filters)
	if (matches.length != 1) {
		return false
	}
	filters = {'bedrooms': 3}
	matches = readPropertiesFromLocalStorage(lat, lng, radius, filters)
	if (matches.length != 1) {
		return false
	}
	return true
}

function add_several_test() {
	// TODO: might want to make this test more precise
	clearLocalStorage()
	lat = 34.102083
	lng = -118.294028
	elem1 = sample_record(lat-.2, lng-.2)
	elem2 = sample_record(lat, lng)
	elem3 = sample_record(lat+.2, lng+.2)
	writeLocalStorage({'results': [elem1, elem2, elem3]})
	filters = {}
	matches = readPropertiesFromLocalStorage(lat, lng, .001, filters)
	if (matches.length != 1) {
		return false
	}
	matches = readPropertiesFromLocalStorage(lat, lng, 20, filters)
	if (matches.length != 3) {
		return false
	}
	matches = readPropertiesFromLocalStorage(lat-.1, lng, 15, filters)
	if (matches.length != 2) {
		return false
	}
	return true
}