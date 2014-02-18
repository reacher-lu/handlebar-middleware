var handlebars = require("handlebars"),
    fs = require("fs"),
    path = require("path"),
    _ = require("underscore"),
    glob = require("glob");

module.exports = function(options) {
  // console.log(options);
  if(!options.source) {
    throw new Error("need to assign a folder to hbs source");
  }
  
  options = options || {};
  
  var globalData = options.globalData || {},
      parseData = function(name) {
        var fp = path.join(options.fixtures, name + ".json"),
            data = {};
        if(fs.existsSync(fp)) {
          data = require(fp) || {};
        }
        return _.extend(globalData, data);
      },
      parseName = function(pathname) {
        var parts = pathname.split("/"),//pathname is part of url
            lastPart = parts.pop(),
            names = lastPart.split("."),
            name;
        if(lastPart) {
          if(names.length > 1) {
            names.pop();
          }
          name = names.join(".");
        } else {
          name = "index";
        }
        return path.join(parts.join(path.sep), name);
      },
      extname = options.extname || ".hbs";
  
  //global data
  if(typeof globalData === "string") {//treat it as a url string
    globalData = require(path.resolve(globalData));
  }
  
  //helpers
  if(options.helpers) {
    glob.sync(options.helpers).forEach(function(file) {
      var basename = path.basename(file, ".js"),
          fp = "./" + file;
      // console.log(basename, fs.existsSync(fp), require(path.resolve(fp)));
      handlebars.registerHelper(basename, require(path.resolve(fp)));
    });
  }
  
  return function(req, res, next) {
    var name = parseName(req.url),
        fp = path.resolve(options.source, name + extname),
        template;
    // console.log(fp, fs.existsSync(fp));
    if(fs.existsSync(fp)) {
      //partials should be reloade everytime
      glob.sync(options.source + "/shared/**/*.hbs").forEach(function(file) {
        var basename = parseName(file.slice(path.join(options.source, "shared").length + 1));
        handlebars.registerPartial(basename, fs.readFileSync(file, "utf8"));
      });
      //load main template
      template = handlebars.compile(fs.readFileSync(fp, "utf8"));
      res.setHeader("content-type", "text/html; charset=utf-8");
      return res.end(template(parseData(name)));
    }
    next();
  };
};