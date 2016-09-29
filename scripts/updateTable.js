function updateTable(data) {
  $("#data-table-tbody tr").remove()
  if (data.length > 0) {
    var rows = ""
    $.each(data, function(i, elem) {
      rows += "<tr>"
      var fa = "missing"
      if (elem['address_object'] != null) {
        if (elem['address_object']['formatted_address'] != null) {
          fa = elem['address_object']['formatted_address']
        }
      }
      rows += "<td>" + handleEmpty(fa) + "</td>"
      rows += "<td>" + handleEmpty(elem['bedrooms']) + "</td>"
      rows += "<td>" + handleEmpty(elem['bathrooms']) + "</td>"
      rows += "<td>" + handleEmpty(elem['building_size']) + "</td>"
      rows += "<td>" + handleEmpty(elem['car_spaces']) + "</td>"
      rows += "<td>" + handleEmpty(elem['listing_type']) + "</td>"
      rows += "<td>" + handleEmpty(elem['price']).formatMoney(2, '.', ',') + "</td>"
      rows += "<td>" + handleEmpty(elem['size_units']) + "</td>"
      rows += "</tr>"
    })
    $("#data-table-tbody").append(rows)
  }
  $('#myTable').tablesorter({
      theme: 'blue'
  });
}

function handleEmpty(val) {
  if (val == null || val == undefined || val == -1) {
    return ""
  } else {
    return val
  }
}

Number.prototype.formatMoney = function(c, d, t){
var n = this, 
    c = isNaN(c = Math.abs(c)) ? 2 : c, 
    d = d == undefined ? "." : d, 
    t = t == undefined ? "," : t, 
    s = n < 0 ? "-" : "", 
    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
    j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
 };
