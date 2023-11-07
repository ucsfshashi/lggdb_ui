import moment from 'moment';

moment.parseTwoDigitYear = function (yearStr) {
    return parseInt(yearStr) + (parseInt(yearStr) > 19 ? 1900 : 2000);
};

async  function CSVToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");
    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp((
    // Delimiters.
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    // Quoted fields.
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    // Standard fields.
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];
    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;
    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {
        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];
        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);
        }
        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {
            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            // We found a non-quoted value.
            var strMatchedValue = arrMatches[3];
        }
        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    // Return the parsed data.
    return (arrData);
}

export async function CSV2JSON(csv) {
    var array = await  CSVToArray(csv);
    var objArray = [];
    for (var i = 1; i < array.length-1; i++) {
        objArray[i - 1] = {};
        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            var key = array[0][k];
            key = key.replace(".","_");
            
            objArray[i - 1][key] = array[i][k]
        }
    }

    var json = JSON.stringify(objArray);
    var str = json.replace(/},/g, "},\r\n");
    var jsonObj = JSON.parse(str);

    return jsonObj;
}

export async function CSVArray2JSON(array,headerObj,typesObj) {
	
	var xyzArray = [];
	
    for (var i = 0; i < array.length; i++) {
    	xyzArray[i - 1] = {};
        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            var key = headerObj[array[0][k]];
            var val = array[i][k];
            
            if(val && typesObj[key] == 'DATE') {
            	val = getFormattedDate(val);
            } 
            xyzArray[i - 1][key] = (val?String(val):val);
        }
    }

    var json = JSON.stringify(xyzArray);
    var str = json.replace(/},/g, "},\r\n");
    var jsonObj = JSON.parse(str);

    return jsonObj;
}



function getFormattedDate(excelSerialDate) {
	
	

	return moment(excelSerialDate, "MM/D/YY").format("MM/DD/YYYY");
	
	/*
	  var date = new Date(Date.UTC(0, 0, excelSerialDate));	
	  var year = date.getFullYear();

	  var month = (1 + date.getMonth()).toString();
	  month = month.length > 1 ? month : '0' + month;

	  var day = date.getDate().toString();
	  day = day.length > 1 ? day : '0' + day;
	  
	  return month + '/' + day + '/' + year;
	  */
}