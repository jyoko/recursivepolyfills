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

  var eatWhite = function() {
    while ( chr.match(/\s/) ) {
      next();
    }
  };

  var error = function(e) {
    throw new SyntaxError(e+' at '+at+' in '+json, 'parseJSON');
  };

  var string = function() {
    var str = '';
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

  var number = function() {
    var result = chr;
    next();
    var digitSet = function() {
      while (chr.match(/\d/)) {
        result = result + chr;
        next();
      }
    }
    var decOrExp = function(punc) {
      if (chr.toUpperCase() === punc) {
        result = result + chr;
        next();
        if (chr.match(/\d/)) {
          digitSet();
        } else {
          error('Unexpected end of input')
        }
      }
    }
    digitSet();
    decOrExp('.');
    decOrExp('E');
    return +result;
  };

  var object = function() {
    var result = {};
    var key;
    if (chr === '{') {
      next();
      eatWhite();  
      if (chr === '}') {
        next();
        return result;
      }
      while (chr) {
        key = string();
        eatWhite();
        next(':');
        result[key] = value();
        eatWhite();
        if (chr === '}') {
          next();
          return result;
        }
        next(',');
        eatWhite();
      }
      error('missing "}"');
    }
  };

  var array = function() {
    var arr = [];

    if ( chr==='[' ) {
      next();
      eatWhite();
      if ( chr === ']' ) {
        next();
        return arr;
      }
      while (chr) {
        eatWhite();
        arr.push(value());
        eatWhite();
        if ( chr === ']' ) {
          next();
          return arr;
        }
        next(',');
        eatWhite();
      }
      error('missing "]"');
    }
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
    eatWhite();
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
