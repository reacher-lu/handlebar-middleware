/*global before, after, describe, it, __dirname */

var expect = require("chai").expect,
    connect = require("connect"),
    cheerio = require("cheerio"),
    hm = require("../src/handlebar_middleware"),
    request = require("request"),
    http = require("http"),
    path = require("path");

describe("Handlebar Middleware", function() {
  var server, port = 3333, data = require("./fixtures/main");
  before(function(done) {
    var app = connect().use(hm({
      source: path.join(__dirname, "./hbs"),
      fixtures: path.join(__dirname, "./fixtures")
    }));
    server = http.createServer(app);
    server.listen(port, done);
  });
  
  after(function(done) {
    server.close(done);
  });
  
  it("should render main page", function(done) {
    request("http://localhost:" + port + "/main", function(e, resp, body) {
      expect(e).to.not.be.ok;
      var $ = cheerio.load(body);
      expect($("h1").text()).to.equal("Static title");
      expect($("header p").text()).to.equal(data.content);
      expect($("article").text().trim()).to.equal(data.lines);
      done();
    });
  });
});