var _ = require("lodash");

exports.scope = {};

exports.refresh = function(scope) {
  exports.scope = scope || {};
};

exports.create = function(pos, type) {
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
    exports.scope[type] = exports.scope[type] || [];
    list = exports.scope[type];
    list.push({
      html: _.template(tpl, {src: src}),
      pos: pos
    });
  };
};

exports.render = function(type) {
  return function() {
    return exports.scope[type].map(function(def) {
      return def.html;
    }).join("\n");
  };
};