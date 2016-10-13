var DataFrame = require('dataframe')

var dimensions = [
  {value: 'firstName', title: 'First Name'},
  {value: 'lastName', title: 'Last Name'},
  {value: 'state', title: 'State'},
  {value: function(row) {
    return row.transaction.business
  }, title: 'Business'},
  {value: function(row) {
    return row.transaction.type
  }, title: 'Transaction Type'}
]

function readLocalStorageToArray(fields, numElement=500) {
	var allData = new Array()
	var keys = Object.keys(localStorage)
	let cnt = 0
	for (k in keys) {
		try {
			raw = JSON.parse(localStorage.getItem(keys[k])) 
			if (typeof raw[fields[0]] !== 'undefined' && cnt <= Math.min(numElement, keys.length)) {
				allData = allData.concat( [fields.map(f => raw[f])])
				cnt += 1
			}
		} catch(err) { console.log(err) }
	}
	return allData
}

function readLocalStorageToDict(fields, numElement=500) {
	var dataDict = {}
	fields.map(f => dataDict[f] = [])
	var keys = Object.keys(localStorage)
	let cnt = 0
	for (k in keys) {
		try {
			raw = JSON.parse(localStorage.getItem(keys[k])) 
			if (typeof raw[fields[0]] !== 'undefined' && cnt <= Math.min(numElement, keys.length)) {
				fields.map(f => 
					dataDict[f] = dataDict[f].concat(raw[f])
					)
				cnt += 1
			}
		} catch(err) { console.log(err) }
	}
	return dataDict
}

export default readLocalStorageToDict