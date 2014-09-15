var engine = require("./engine"),
    url = require("url");

module.exports = function(options) {
  var render = engine(options);
  
  return function(req, res, next) {
    var parsed = url.parse(req.url, true);
    render(parsed.pathname === "/" ? "/index" : parsed.pathname, function(e, resp) {
      if(e) {
        return next(e);
      }
      if(resp) {
        res.setHeader("content-type", "text/html; charset=utf-8");
        res.end(resp);
        return;
      }
      next();
    });
  };
};