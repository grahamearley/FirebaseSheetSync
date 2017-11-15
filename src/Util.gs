
// Create a JSON object from a row given its columnObject
//	(an object of keys whose values are column numbers where
//	the value of that key should go in the created object).
//	Return this object and the ID in a payload object.
function getIdAndObjectFromRow(row, columnObject, languageCode) {
	var id = row[columnObject[ID]];

	if (!id) {
		throw new Error("The following row is missing an ID. Row:" + row);
	}

	var keys = columnObject[KEYS];
	var object = {};
	for (var i = 0; i < keys.length; i++) {
		var key = keys[i];
		var column;

		if (key === NAME && columnObject[key][languageCode]) {
			column = columnObject[key][languageCode];
		} else {
			column = columnObject[key];
		}

		object[key] = row[column];
	}

	var payload = {};
	payload[ID] = id;
	payload[OBJECT] = object;

	return payload;
}

// Sort data so that rows with a name for the given language appear first.
function getDataSortedByLanguage(data, columnObject, languageCode) {
	var columnForLanguageName = columnObject[NAME][languageCode];
	if (!columnForLanguageName) {
		throw new Error("The language " + languageCode + " does not have a NAME column assigned. Operation cancelled.");
	}

	return ArrayLib.sort(data, columnForLanguageName, false); // false => descending
}

function writeIds(sheet, idColumn, idGenerator) {
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
	writeIdAtRowNumber(i, sheet, data, idColumn, idGenerator);
  }
}

function writeIdAtRowNumber(rowNumber, sheet, data, idColumn, idGenerator) {
	var row = data[rowNumber];
	var id = idGenerator(row);

	var idCell = sheet.getRange(rowNumber + 1, idColumn + 1);
	idCell.setValue(id);
	idCell.setBackground("green");
}

/**
 * Iterate over the given data until the data at column nameColumn
 * 	is empty. At each iteration, run the loopFunction, which can take
 * 	a row array as a parameter.
 */
function forRowsWithLanguageName(data, columnObject, languageCode, loopFunction) {
    var sortedData = getDataSortedByLanguage(data, columnObject, languageCode);

    var currentRow = 0;
    var row = sortedData[currentRow];

    while (row && row[columnObject[NAME][languageCode]]) {
        loopFunction(row);
        currentRow++;
        row = sortedData[currentRow];
    }
}

/**
 * Filter a 2D array into a 2D array where the given column equals
 *  the given value.
 *
 *  (This is a replacement helper function of the filterByText function
 *   in the ArrayLib library. The ArrayLib version of the function does
 *   not do an exact match, but rather checks if the element at the column
 *   contains the value).
 *
 * @param data the 2D array
 * @param column the column of the value to check
 * @param value the value to check
 * @returns {Array} the filtered array
 */
function filterExactByText(data, column, value) {
    filteredArray = [];
    for (var i = 0; i < data.length; i++) {
        var row = data[i];
        if (row[column] === value) {
            filteredArray.push(row);
        }
    }

    return filteredArray;
}

function contains(array, element) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] === element) {
            return true;
        }
    }
    return false;
}

function forEach(array, func) {
    for (var i = 0; i < array.length; i++) {
        var element = array[i];
        func(element);
    }
}

function getRemovedItems(previousItems, newItems) {
    const removedItems = [];
    for (var i = 0; i < previousItems.length; i++) {
        var previousItem = previousItems[i];
        if (previousItem && newItems.indexOf(previousItem) === -1) {
            removedItems.push(previousItem);
        }
    }

    return removedItems;
}

function getColumnAsArray(data, column) {
    return data.map(function(value, i) { return value[column] });
}

function getNameInFirstLanguageAvailable(row, columnsObject) {
    var englishName = row[columnsObject[NAME][ENGLISH_LOCALE]];

    if (englishName) {
        return englishName;
    }

    var marathiName = row[columnsObject[NAME][MARATHI_LOCALE]];

    if (marathiName) {
        return marathiName;
    }

    var hindiName = row[columnsObject[NAME][HINDI_LOCALE]];

    if (hindiName) {
        return hindiName;
    }

    throw new Error("ID generation error! No name found for row: " + row);
}