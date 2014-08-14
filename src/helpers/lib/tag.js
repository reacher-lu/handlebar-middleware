var _ = require("lodash");

exports.list = function(type) {
  if(!exports.scope[type]) {
    exports.scope[type] = [];
  }
  return exports.scope[type];
};

exports.refresh = function(scope) {
  exports.scope = scope || {};
};

exports.create = function(pos, type, options) {
  var tpl, list;
  switch(type) {
  case "style":
    tpl = "<link href='<%= src %>' rel='stylesheet'></link>";
    break;
  case "script":
    tpl = "<script src='<%= src %>'></script>";
    break;
  }
  return function(src) {
    options = options || {};
    list = exports.list(type);
    var html = _.template(tpl, {src: src});
    if(options.prefix) {
      html = options.preifx + html;
    }
    if(options.suffix) {
      html += options.suffix;
    }
    list.push({
      html: html,
      pos: pos
    });
  };
};

exports.render = function(type) {
  return function() {
    var list = exports.list(type);
    return list.map(function(def) {
      return def.html;
    }).join("\n");
  };
};


exports.block = function(type) {
  return function(options) {
    var list =  exports.list(type);
    // if(typeof search !== "string") {
    //   options = search;
    //   search = null;
    // }
    // var prefix, suffix;
    // prefix = type === "script" ? "<!-- build:js <%= dest %> -->" : "<!-- build:css <%= search ? '(' + search +  ')' : '' %> <%= dest %> -->\n";
    // suffix = "\n<!-- endbuild -->";
    
    list.push({
      // html: prefix + options.fn(this) + suffix,
      html: options.fn(this),
      pos: type === "style" ? "head": "tail"
    });
    
  };
};