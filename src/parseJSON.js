var parseJSON = function(json) {
  // The easy way:
  // return eval('('+json+')');

  // The hard way:

  // escape char obj
  var esc = {
              '"':'"',
              '\\':'\\',
              '/':'/',
              'n':'\n',
              'r':'\r',
              't':'\t',
              "'":"'",
              'f':'\f',
              'b':'\b'
  };
  // at is current position #
  var at;
  // chr is current character
  var chr;
  // result is obj being built
  var result;

  var error = function(e) {
    throw new SyntaxError(e+' at '+at+' in '+json, 'parseJSON');
  };

  var string = function() {
    var str;
    if (chr==='"') {
      while( next() ) {
        if (chr==='"') {
          next();
          return str;
        } else if (chr==='\\') {
          next();
          //if u unicode
          //i think hex too
          if ( esc.hasOwnProperty(chr) ) {
            str+=esc[chr];
          } else {
            error('Unexpected token');
          }
        } else {
          str+=chr;
        }
      }
    }
    error('Bad string');
  };

  var array = function() {
    
  };

  var number = function() {
    var result = chr;
    next();
    while (chr.match(/\d/)) {
      result = result + chr;
      next();
    }
    return +result;
  };

  var object = function() {

  };

  var word = function() {
    switch(chr) {
      case 't':
        next('t');
        next('r');
        next('u');
        next('e');
        return true;
      case 'f':
        next('f');
        next('a');
        next('l');
        next('s');
        next('e');
        return false;
      case 'n':
        next('n');
        next('u');
        next('l');
        next('l');
        return null;
    }
    error('Unexpected "'+chr+'"');
  };
  
  // move to next char
  var next = function(c) {
    if (c && c!==chr) {
      error('Expected "'+c+'"');
    }
    at+=1;
    chr = json.charAt(at);
    return chr;
  };

  // this is what loops
  var value = function() {
    while ( chr.match(/\s/) ) {
      next();
    }
    if (chr==='{') {
      return object();
    }
    if (chr==='[') {
      return array();
    }
    if (chr==='-' || chr.match(/\d/) ) {
      return number();
    }
    if (chr==='"') {
      return string();
    }
    return word();
  };

  at = -1;
  next();
  result = value();
  return result;
};
