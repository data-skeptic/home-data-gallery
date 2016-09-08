// call by doSearch() in code.js
// Need unit test
function writeLocalStorage(data) {
  var toCache = {}
  console.log(data.length)
  if (data.length > 0) {
    $.each(data, function(i, elem) {
      toCache['id'] = elem['id']
      toCache['address'] = elem['address_object']['formatted_address']
      toCache['bedrooms'] = elem['bedrooms']
      toCache['bathrooms'] = elem['bathrooms']
      toCache['building_size'] = elem['building_size']
      toCache['car_spaces'] = elem['car_spaces']
      toCache['listing_type'] = elem['listing_type']
      toCache['price'] = elem['price']
      toCache['size_units'] = toCache['size_units']
      toCache['latitude'] = elem['address_object']['latitude']
      toCache['longitude'] = elem['address_object']['longitude']
      // Save data elemenet to cache by element id
      localStorage.setItem(elem['id'], JSON.stringify(toCache))
    })
  }
}

// get data from LocalStorage
// need to be able to filter etc
function readLocalStorage(id) {
  localStorage.getItem(i)
}

// get data through API
function callREST() {
  var request = get_request()
  return $.ajax({url: update_curl_req(request)})
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