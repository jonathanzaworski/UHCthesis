var _ = require('lodash');
var menudata = require('../data/menu.json');
var menubuilder = require('../menubuilder');
var capitalize = require('../capitalize');
var randomizer = require('../randomizer');
var MongoClient = require('mongodb').MongoClient
		, format = require('util').format; 

//function isRadial ():Boolean {
//		return Math.random() >= 0.5;
//};

/*
function clickEventHandler (req, res, target, clickData) {
	if (typeof req.session.destination === 'undefined'){
		req.session.clickEvent = [];
	}
	else {
		req.session.clickEvent.push({
			clickTarget: req.body.target,
			clickActual: req.body.clicks,
			clickTime: req.body.time
		})
	}
};*/

function storeSessionData (req, res, target, data) {

	if (typeof req.session.destination === 'undefined'){		
			req.session.destination = [target];
//			req.session.pageStartTime = [];
//			req.session.pageEndTime = [Date.now()];
			req.session.pageCounter = req.session.pageCounter + 1;			
			req.session.save(function (err) {
	
			// Alright! Unless there was an error, the session
			// should now contain the noun and the adjective..
				if (err) {
					console.error('Wtf, session saving failed.');
				}
				res.render('layout', data);
			});
		}		
	
	else if (req.session.pageCounter > 2) {
			req.session.destination.push(target);
//			req.session.pageEndTime.push(Date.now());
			req.session.save(function (err) {

			// Alright! Unless there was an error, the session
			// should now contain the noun and the adjective..
				if (err) {
					console.error('Wtf, session saving failed.');
				}
				res.redirect('/finish');
			});
		}
		
	else {
			req.session.destination.push(target);
			req.session.pageCounter = req.session.pageCounter + 1;
//			req.session.pageEndTime.push(Date.now());
			req.session.save(function (err) {

			// Alright! Unless there was an error, the session
			// should now contain the noun and the adjective..
				if (err) {
					console.error('Wtf, session saving failed.');
				}
				res.render('layout', data);
			});
		};
	console.log(req.session.pageCounter);
};


function showNextPage (req, res, target, bootstrap) {
	var currentPage = _.compact(req.url.split('/'));
			currentPage = capitalize(currentPage[0]) + currentPage[1];
	
	var data = {
		partials: { body: 'index' },
		title: 'Home' + currentPage,
		listMenu: menubuilder(menudata.root),
		pageName: currentPage,
		noun: target,
		adjective: 'Page',
		bootstrap: JSON.stringify(bootstrap),			
	};
	storeSessionData(req, res, target, data)
	console.log(req.session)
	if (req.session.pageCounter <= 2) {
	req.session.pageStartTime.push(Date.now())
	}
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
	app.get('/start', function (req, res, next) {
    var params = {
			pageName: 'First Page',
			bootstrap: []		
		};

    var data = {
      partials: {
        // Notice that we're passing the name of the
        // body partial into the layout.
        body: 'form'
      },

      // ..and "title" is used by the view
      title: 'Start',
			listMenu: []
    };

		res.render('layout', _.extend(data, params))		
	});

	app.get('/finish', function (req, res, next) {
    var params = {
			pageName: 'Final Page',
			bootstrap: []		
		};

    var data = {
      partials: {
        // Notice that we're passing the name of the
        // body partial into the layout.
        body: 'endform'
      },

      // ..and "title" is used by the view
      title: 'Finish',
			listMenu: []
    };
		res.render('layout', _.extend(data, params))		
	});

  app.get('/main', function (req, res, next) {
		req.session.pageCounter = 0;
		req.session.pageStartTime= [Date.now()];
    // Set some defaults for the view data
		var target = randomizer();
		var bootstrap = { nextPage: target };  
				target = _.compact(target.split('/'));
				target = capitalize(target[0]) + target[1];		  
		var defaults = {		
			pageName: 'Thesis Project: Beginning',
			noun: target,
			adjective: 'Page',
			bootstrap: JSON.stringify(bootstrap),
    };


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


/* 
  // Show a form
  app.get('/form', function (req, res, next) {
    var data = {
      partials: { body: 'form' }
    };
    res.render('layout', data);
  });
*/
	
	app.post('/events', function(req, res, next) {
		var clickEvent = {
				clickTarget: req.body.target,
				clickActual: req.body.clicks,
				clickTime: req.body.time
		};

		if (typeof req.session.clickEvent === 'undefined'){
			req.session.clickEvent = [clickEvent];
		}
		else {
			req.session.clickEvent.push(clickEvent)
		}
		req.session.save(function (err) {

		// Alright! Unless there was an error, the session
		// should now contain the noun and the adjective..
			if (err) {
				console.error('Wtf, session saving failed.');
			}
		});
		console.log(req.session.clickEvent)
		 
	});	


  // Handle a POSTed form.
  app.post('/form', function (req, res, next) {

    var data, error;

    // handle some errors
    if (typeof req.body.sex == 'undefined') {
      error = 'Please Select a Gender';
    }
    else if (typeof req.body.age == 'undefined') {
      error = 'Please Select an Age Group';
    }
    else if (typeof req.body.tech == 'undefined') {
      error = 'Please Select a Level of Computer Experience';
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
    req.session.demographics = {
			age :  req.body.age,
			gender : req.body.sex  , 
			techSavvy: req.body.tech
		};

    req.session.save(function (err) {

		// Alright! Unless there was an error, the session
		// should now contain the noun and the adjective..
			if (err) {
				console.error('Wtf, session saving failed.');
			}
		});
		res.redirect('/main');
  });

  // Handle a POSTed form.
  app.post('/canSave', function (req, res, next) {
		if (req.body.save == 'no') {
			return res.redirect('/nodataforyou')
		};
		
		return res.redirect('/save');
  });
		

  // Save a user session.
  // We would probably want to POST this from a consent
  // form, but we can show it off by visiting `/save` 
  // and checking the console.
  app.get('/save', function (req, res, next) {

    // We could process data a bit, but we don't need to.
    var data = req.session;
    
    // 1. Dump a copy to the log
//    console.log(data);

    // 2. Send a copy back to the browser
    //res.send(200, data);
 
     //use this link for heroku database: mongodb://heroku:bdca8308645ba6dd5dbaff676c5c2597@dharma.mongohq.com:10092/app16769713

		var testObject = {
//		***Don't try to run until you've set it up to run this stuff.***
				demographicData : req.session.demographics,
				targets : req.session.destination,
				startTimes : req.session.pageStartTime,
//				endTimes : req.session.pageEndTime,
				clickEvents : req.session.clickEvent
		};

		console.log(testObject);
/*
		MongoClient.connect('mongodb://127.0.0.1:27017/thesisdb', function(err, db) {
			if(err) throw err;

			var collection = db.collection('sessionData');
			var testObject = {
//		***Don't try to run until you've set it up to run this stuff.***
//				demographicData : req.session.demographics,
				targets : req.session.destination,
				startTimes : req.session.pageStartTime,
				endTimes : req.session.pageEndTime
			};
			collection.insert({Testdata : testObject }, function(err, docs) {

				collection.count(function(err, count) {
					console.log(format("count = %s", count));
				});

				// Locate all the entries using find
				collection.find().toArray(function(err, results) {
					console.dir(results);
					// Let's close the db
					db.close();
				});      
			});
		})
*/
		res.redirect('/null');
  });

	// TEST: THIS WASN'T A DISASTER. SOMEHOW.
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
	});

	app.post('/events', function(req, res, next) {	
		res.send( 200, JSON.stringify(req.body));

	//	console.log(req.body);			
	});
};

/*
var events = {
	timestamps = []
}
*/
