function writeLocalStorage(data) {
  console.log(data.length)
  if (data.length > 0) {
    $.each(data, function(i, elem) {
      console.log(elem['id'], elem['address_object']['raw'], 
        elem['address_object']['latitude'], 
        elem['address_object']['longitude'])
    })
  }
}

$.ajax({
  url: murl,
    type: 'GET',
    contentType: 'text/json',
    dataType: 'json',
    success: function(resp) {
      console.log("success ajax")
      console.log(resp.length)
      writeLocalStorage(resp['results'])
    },
    error: function() {
      console.log('error')
    }
  })
