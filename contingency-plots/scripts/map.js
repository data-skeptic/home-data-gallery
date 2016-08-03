var map_obj = {'id': 0}

      function mapInit(mapContainer, infoContainer, properties, lat, lon, zoom) {
        map = new OpenLayers.Map(mapContainer);
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
      }

      function renderPropertyInfoBox(property) {
        var htm = "<div class='propertyDetailBox'>"
        htm += "<b>" + property.address + "</b><br/>"
        htm += "Price: <b>" + property.sale_price + "</b><br/>"
        htm += "Beds: <b>" + property.bedrooms + "</b> Baths: <b>" + property.bathrooms + "</b><br/>"
        htm += "</div>"
        return htm
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
      