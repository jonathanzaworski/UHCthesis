var express = require('express')
  , cons = require('consolidate')
  , path = require('path');

var port = process.env.PORT || 5000;

var appDir = path.join(__dirname, 'app/');

// Start a new application
var app = express();

// Tell it to use Hogan
app.engine('hjs', cons.hogan);

// all environments
app.set('port', port);
app.set('views', 'views');
app.set('view engine', 'hjs');

// This is the middleware stack. Each thing being passed
// to `app.use` is a function following a consistent format:
//
//     function (req, res, next) {
//       // req: the request
//       // res: the response
//       // next: pass on to the next middleware function
//     }
//
// The one exception are error handlers, which take a slightly
// different form. Let's not worry about those for now.
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());

// Up until now, all of the middleware have just been modifying
// the request. Now it's time to add a few that can actually 
// send responses.

// Send express's favicon (a little blue thing). We could replace
// this by removing this middleware and adding a `favicon.ico`
// file to the `public/` directory.
app.use(express.favicon());

// The router! All routes defined using express's syntax will be
// handled here.
app.use(app.router);

// Finally, routes that didn't match any of the ones defined for
// express may be served as static files in the `public/` 
// directory
app.use(express.static('public'));

// development only
if ('development' == app.get('env')) {

  // Remember error handling? We'll add one of those middleware
  // here. This is probably all you will have to worry about it
  app.use(express.errorHandler());
}

// Time to actually define some routes. These are located in the
// `routes/index.js` file (we can omit `index.js`, as it's the
// file that node will look for when a directory is `require`d),
// and we'll pass in the application as an argument.
require('./routes')(app);

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

