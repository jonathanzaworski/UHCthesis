var express = require('express')
  , cons = require('consolidate')
  , path = require('path');

var port = process.env.PORT || 5000;

var appDir = path.join(__dirname, 'app/');

var app = express();

app.engine('hjs', cons.hogan);

// all environments
app.set('port', port);
app.set('views', 'views');
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static('public'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// include routes
require('./routes')(app);

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});

