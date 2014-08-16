# handlebar-middleware

Handlebars rendering middelware for testing and dev

```
var hm = require("handlebar_middleware")({
  source: "PATH_TO_HBS_FOLDER",
  fixtures: "PATH_TO_FIXTURES",
  helpers: "PATH_TO_HELPERS",
  globalData: {}//global data object
});

var app = connect().use(hm);

```


## Grunt task

