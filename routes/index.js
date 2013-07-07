var _ = require('lodash');
var menudata = require('../data/menu.json');
var menubuilder = require('../menubuilder');
var capitalize = require('../capitalize');
var randomizer = require('../randomizer');

function showNextPage (req, res, target, bootstrap) {
	var currentPage = _.compact(req.url.split('/'));
			currentPage = capitalize(currentPage[0]) + currentPage[1];

	var data = {
		partials: { body: 'index' },
		title: 'Home' + currentPage,
		listMenu: menubuilder(menudata.root),
		pageName: 'Item ' + currentPage,
		noun: target,
		adjective: 'Page',
		bootstrap: JSON.stringify(bootstrap)				
	};
	console.log(Date.now());
	res.render('layout', data);
		if (typeof req.session.destination === 'undefined'){		
			req.session.destination = [];
			req.session.timestamp = []
			req.session.save(function (err) {
	
			// Alright! Unless there was an error, the session
			// should now contain the noun and the adjective..
				if (err) {
					console.error('Wtf, session saving failed.');
				}
			});
		};
}

// This is the main route file. Note that its only
// export is a function that takes an (express)
// application as its argument.
module.exports = function (app) {

  // Define an index route. Express allows for us to
  // use handy helpers for defining GET, PUT, POST,
  // and DELETE routes:
  //
  //   * app.get
  //   * app.put
  //   * app.post
  //   * app.delete
  //
  // Since we want to GET the homepage, we'll pass
  // in its path (`'/'`) and a middleware for handling
  // it.
  app.get('/', function (req, res, next) {

    // Set some defaults for the view data
		var target = randomizer();
		var bootstrap = { nextPage: target };  
				target = _.compact(target.split('/'));
				target = capitalize(target[0]) + target[1];		  
		var defaults = {		
			pageName: 'My Thesis Project: Home',
			noun: target,
			adjective: 'Page',
			bootstrap: JSON.stringify(bootstrap)	
    };

/*		req.session.destination = [target];
		req.session.timestamp = [Date.now()]
		req.session.save(function (err) {

		// Alright! Unless there was an error, the session
		// should now contain the noun and the adjective..
			if (err) {
				console.error('Wtf, session saving failed.');
			}
		}); */

    // Let's create a variable, "params", that starts
    // with the defaults above and overwrites them
    // with the 'noun' and 'adjective' fields from the
    // session if they're available.
    //
    // Another way to write this would be:
    //
    //     var params	 = defaults;
    //     if (req.session.noun) params.noun = req.session.noun
    //     if (req.session.adjective) params.adjective = req.session.adjective
    //

    var params = _.extend(defaults, _.pick(req.session, 'noun', 'adjective', 'pageName'));
		var temp = menubuilder(menudata.root);	

    // Define some data for the view...
    var data = {
      partials: {
        // Notice that we're passing the name of the
        // body partial into the layout.
        body: 'index'
      },

      // ..and "title" is used by the view
      title: 'Home',
			listMenu: menubuilder(menudata.root)
    };

    // Render the layout. Routing middleware *must*
    // either take a response (res.render, res. send,
    // etc.) or call the `next()` method to pass 
    // control to the next middleware method in the
    // stack. If they do not, the application *will*
    // hang.
    res.render('layout', _.extend(data, params));
  });
 
  // Show a form
  app.get('/form', function (req, res, next) {
    var data = {
      partials: { body: 'form' }
    };
    res.render('layout', data);
  });


  // Handle a POSTed form.
  app.post('/form', function (req, res, next) {

    var data, error;

    // handle some errors
    if (req.body.adjective.length < 3) {
      error = 'The adjective must be at least three letters long';
    }
    else if (req.body.noun.length < 3) {
      error = 'The things must be at least three letters long';
    }

    if (error) {

      // show the form again, this time with an error
      data = {
        partials: { body: 'form' },
        error: error
      };

      // we *must* return after rendering, so that we
      // don't try to respond again later in this method
      // 
      // We still want to keep the submitted values around,
      // so we'll `extend` data with the body of the
      // submitted request.
      return res.render('layout', _.extend(data, req.body));
    }

    // Ok, now we've succeeded. Groovy. We'll store the
    // variables in the user's session for later use...
    req.session.noun = req.body.noun;
    req.session.adjective = req.body.adjective;
    req.session.save(function (err) {

		// Alright! Unless there was an error, the session
		// should now contain the noun and the adjective..
			if (err) {
				console.error('Wtf, session saving failed.');
			}
		});
		showNextPage(req, res, target, bootstrap);
  });


  // Save a user session.
  // We would probably want to POST this from a consent
  // form, but we can show it off by visiting `/save` 
  // and checking the console.
  app.get('/save', function (req, res, next) {

    // We could process data a bit, but we don't need to.
    var data = req.session;
    
    // 1. Dump a copy to the log
    console.log(data);

    // 2. Send a copy back to the browser
    res.send(200, data);
  });

	// TEST: THIS MAY BE A DISASTER
	app.use(function (req, res, next) {

		var letters = 'abcde',
				numbers = '12345';


		var components = _.compact(req.url.split('/'));
		var target = randomizer();
		var bootstrap = { nextPage: target };
		target = _.compact(target.split('/'));
		if (letters.indexOf(components[0]) > -1 &&
				numbers.indexOf(components[1]) > -1) {
				target = capitalize(target[0]) + target[1];
			// now what?
			// res.send(200, 'Replace me with something better.');
			showNextPage(req, res, target, bootstrap);

		}
		else {
			next();
		}
		if (typeof req.session.destination === 'undefined'){		
			req.session.destination = [];
			req.session.timestamp = []
			req.session.save(function (err) {
	
			// Alright! Unless there was an error, the session
			// should now contain the noun and the adjective..
				if (err) {
					console.error('Wtf, session saving failed.');
				}
			});
		}		
		
		else {
			req.session.destination.push(target);
			req.session.timestamp.push(Date.now())
			req.session.save(function (err) {

			// Alright! Unless there was an error, the session
			// should now contain the noun and the adjective..
				if (err) {
					console.error('Wtf, session saving failed.');
				}
			});
		};
	});
	
	app.post('/events', function(req, res, next) {
	
			res.send( 200, JSON.stringify(req.body));
			console.log(req.body);			
	});
};

/*
var events = {
	timestamps = []
}
*/
