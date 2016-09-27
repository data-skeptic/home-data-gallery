var ApiConnectorSingleton = (function () {
    var instance;
 
    function createInstance() {
        var object = new Object()
        object.request = null
        object.count = 0
        object.limit = 500
        object.offset = 0
        object.numCalls = 0
        object.call_api = true
        object.filters = {}
        object.busy = false
        object.isRunning = function() {
            if (this.offset <= this.count) {
                return false
            } else {
                return true
            }
        }
        object.setRequest = function(request) {
            this.request = request
            this.offset = 0
            this.count = 1
        }
        object.setFilters = function(filters) {
            this.filters = filters
        }
        object.update = function() {
            this.numCalls += 1
            if (this.call_api) {
                if (this.isRunning()) {
                    callApi()
                }
            }
            return this
        }
        object.callApi = function() {
            if (this.request != null && this.offset < this.count) {
                var cloned = JSON.parse(JSON.stringify(this.request))
                cloned['limit'] = this.limit
                cloned['offset'] = this.offset
                if (!this.busy && this.numCalls < 99) {
                  console.log(["Requesting", this.limit, this.offset, this.count, this.numCalls])
                  murl = update_curl_req(cloned)
                  //$("#curl").val(murl) # this would include the offset, which is wierd
                  console.log(murl)
                  this.busy = true
                  var api = this
                  $.ajax({
                      url: murl,
                      type: 'GET',
                      contentType: 'text/json',
                      dataType: 'json',
                      success: function(resp) {
                        writeLocalStorage(resp) // localStorageIO.js
                        api.count = resp['count']
                        api.offset += resp['results'].length
                        var bounds = map.getExtent().clone()
                        bbox = bounds.transform(map.getProjectionObject(), new OpenLayers.Projection("EPSG:4326"))
                        this.filters = get_request()
                        results = readPropertiesFromLocalStorage(bbox, this.filters)
                        updateMap(results)
                        updateTable(results) // updateTable.js
                        makePlots(results)
                        api.busy = false
                        $(".wait-spinner").hide()
                      },
                      error: function (xhr, ajaxOptions, thrownError) {
                        //console.log(xhr.responseText)
                        console.log(thrownError)
                        api.busy = false
                      }
                  })
                } else {
                    if (this.numCalls >= 99) {
                        console.log("Skipping update due to excess calls")
                    }
                }
                
            }
        }
        return object
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();
