var http = require("http");
var url= require("url");

function start(route, handle) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    console.log('Request for ' + pathname + ' received');

    route(handle, pathname, response);

    response.writeHead (400, {"Content-Type": "text/plain"});
    response.write("Hello Cruel World!");
    response.end();
    }

  http.createServer(onRequest).listen(5000);
  console.log('Server has started.');
}

exports.start = start;
