// Add second optional parameter to take in node
var getElementsByClassName = function(className, node){
  // if second parameter not provided, default document.body
  node = node || document.body;
  // initialize and assign result to empty
  var result = [];
  // if className is in node's classList
  if ( node.classList && node.classList.contains(className) ) {
    // push node to result
    result.push(node);
  }

  // iterate over node's children
  if ( node.hasChildNodes() ) {
    var children = node.childNodes;
    var len = children.length;
    for (var i=0;i<len;i++) {
        // concatenate to result the resursive call using className and child node
        // we _could_ push to result but have to prune empty values
        // concat returns new array, doesn't modify old one!
        result = result.concat(getElementsByClassName(className,children[i]));
    }
  }

  // return result
  return result;
};
