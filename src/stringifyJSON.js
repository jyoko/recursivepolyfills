var stringifyJSON = function(obj) {

  // check undefined or function
  if (typeof obj === 'function' || typeof obj === 'undefined') {
    return undefined;
  }

  // check number, boolean, or null
  if (obj === null || typeof obj === 'number' || typeof obj === 'boolean') {
    if (typeof obj === 'number' && isNaN(obj)) {
      return 'null';
    }
    return obj + '';
  }

  // check string
  if (typeof obj === 'string') {
    return '"' + obj + '"';
  }


  // check objects/arrays
    // begin string ({)
    // arrays use FOR ([val+','] if not end)
    // objects need keys ({"key":"val"})
    // recurse on every item in either using correct format
    // end string (})

  if (typeof obj === 'object') {
    var result = [];
    var elementStr;
    if (Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        elementStr = stringifyJSON(obj[i]);
        if (elementStr === undefined) {
          result.push('null');
        } else {
          result.push(elementStr);
        }
      }
      return '[' + result.join(',') + ']';
    } else {
      for (var key in obj) {
        elementStr = stringifyJSON(obj[key]);
        if (elementStr !== undefined) {
          result.push(stringifyJSON(key) + ':' + elementStr);
        }
      }
      return '{' + result.join(',') + '}';
    }
  }
};
