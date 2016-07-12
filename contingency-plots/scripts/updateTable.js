function updateTable(resp) {
  $("#data-table-tbody tr").remove(); 
  if (resp['count'] > 0) {
    data = resp['results']
    var rows = ""
    $.each(data, function(i, elem) {
      rows += "<tr>"
      var fa = "missing"
      if (elem['address_object'] != null) {
        if (elem['address_object']['formatted_address'] != null) {
          fa = elem['address_object']['formatted_address']
        }
      }
      rows += "<td>" + fa + "</td>"
      rows += "<td>" + elem['bedrooms'] + "</td>"
      rows += "<td>" + elem['bathrooms'] + "</td>"
      rows += "<td>" + elem['building_size'] + "</td>"
      rows += "<td>" + elem['var_spaces'] + "</td>"
      rows += "<td>" + elem['listing_type'] + "</td>"
      rows += "<td>" + elem['price'] + "</td>"
      rows += "<td>" + elem['size_units'] + "</td>"
      rows += "</tr>"
    })
    $("#data-table-tbody").append(rows)
  }
  $('#myTable').tablesorter({
      theme: 'blue'
  });
}


