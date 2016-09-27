var map_obj = {'id': 0}

function mapInit(mapContainer, infoContainer, properties, lat, lon, zoom, eventListeners=null) {
  if (eventListeners == null) {
    map = new OpenLayers.Map('map');
  } else {
    map = new OpenLayers.Map('map', eventListeners);    
  }

  var mapnik         = new OpenLayers.Layer.OSM();
  var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
  var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
  var position       = new OpenLayers.LonLat(lon, lat).transform( fromProjection, toProjection);
  console.log(zoom)
  console.log(position)

  var markers = new OpenLayers.Layer.Markers( "Markers" )
  map.addLayer(markers)
  map_obj['markers'] = markers
  map_obj['infoContainer'] = infoContainer

  for (var i=0; i < properties.length; i++) {
    var property = properties[i]
    var lon = property['longitude']
    var lat = property['latitude']
    var ll = new OpenLayers.LonLat(lon,lat).transform(fromProjection, toProjection)
    var marker = new OpenLayers.Marker(ll)
    marker.id = i
    marker.address = property['address']
    marker.sale_price = property['sale_price']
    marker.bedrooms = property['bedrooms']
    marker.bathrooms = property['bathrooms']
    marker.events.register("mousedown", marker, function() {
      htm = renderPropertyInfoBox(this)
      $("#" + infoContainer).html(htm)
    })
    map_obj['id'] = i
    markers.addMarker(marker)
  }

  map.addLayer(mapnik);
  map.setCenter(position, zoom );
  return map
}

function renderPropertyInfoBox(property) {
  var htm = "<div class='propertyDetailBox'>"
  htm += "<b>" + property.address + "</b><br/>"
  htm += "Price: <b>" + property.sale_price + "</b><br/>"
  htm += "Beds: <b>" + property.bedrooms + "</b> Baths: <b>" + property.bathrooms + "</b><br/>"
  htm += "</div>"
  return htm
}

function remove_all_markers() {
  markers = map_obj['markers']
  markers.clearMarkers();
}

function add_marker(property) {
  var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
  var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    markers = map_obj['markers']
    infoContainer = map_obj['infoContainer']
    var lon = property['longitude']
    var lat = property['latitude']
    var ll = new OpenLayers.LonLat(lon,lat).transform(fromProjection, toProjection)
    var marker = new OpenLayers.Marker(ll)
    marker.id = map_obj['id']
    map_obj['id'] += 1
    marker.address = property['address']
    marker.sale_price = property['sale_price']
    marker.bedrooms = property['bedrooms']
    marker.bathrooms = property['bathrooms']
    marker.events.register("mousedown", marker, function() {
      htm = renderPropertyInfoBox(this)
      $("#" + infoContainer).html(htm)
    })
    markers.addMarker(marker)
}

function haversine_distance(lat1, lon1, lat2, lon2) {
  Number.prototype.toRad = function() {
   return this * Math.PI / 180;
  }

  var R = 6371; // km 
  //has a problem with the .toRad() method below.
  var x1 = lat2-lat1;
  var dLat = x1.toRad();  
  var x2 = lon2-lon1;
  var dLon = x2.toRad();  
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + 
                  Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
                  Math.sin(dLon/2) * Math.sin(dLon/2);  
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; 
  return d
}