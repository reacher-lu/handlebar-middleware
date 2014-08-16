var engine = require("./engine");

module.exports = function(options) {
  var render = engine(options);
  
  return function(req, res, next) {
    render(req.url === "/" ? "/index" : req.url, function(e, resp) {
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