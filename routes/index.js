module.exports = function (app) {

  app.get('/', function (req, res, next) {
    var data = {
      partials: {
        body: 'index'
      },
      adjective: 'cruel',
      noun: 'world',
      title: 'Home'
    };

    res.render('layout', data);
  });
};
