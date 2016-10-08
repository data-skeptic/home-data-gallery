function singleton_works_test() {
    var instance1 = ApiConnectorSingleton.getInstance()
    var instance2 = ApiConnectorSingleton.getInstance()
 
    if (instance1 === instance2) {
    	return true
	} else {
		return false
	}
}

function get_mock_request() {
  request = {'min_price': 0,
      'max_price': 1000000,
      'min_bedrooms': 0,
      'max_bedrooms': 3,
      'min_bathrooms': 0,
      'max_bathrooms': 3,
      'min_building_size': 0,
      'max_building_size': 99999,
  }	
}

function is_running_test() {
    var api = ApiConnectorSingleton.getInstance()
    if (api.isRunning()) {
    	return false
    }
    api.setRequest(get_mock_request())
    scheduledCall = setInterval(function() {api.update()}, 10)
    if (!api.isRunning) {
    	return false
    }

    var waitUntil = new Date().getTime() + 500
    var counter = 0
    function waitForUpdates() {
      var now = new Date().getTime()
      counter += 1
      if (now < waitUntil) {
        return false
      } else {
        return true
      }
    }
    function waiter() {
      $.when(waitForUpdates())
        .then(function(c) {
            if (c == false) {
              // time not yet expired, so try again
              waiter()
            } else {
              // time is expired
              return true
            }
        })
        .fail(function(){
          console.log("failure")
          return false
        })
    }
    console.log(counter)
    waitResult = waiter()
    console.log(counter)
    if (!waitResult) {
      return false
    }
    if (api.numCalls < 2) {
      return false
    } else {
      return true
    }
    clearInterval(scheduledCall)
}
