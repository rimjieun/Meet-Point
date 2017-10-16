var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var path = require('path');
var request = require('request');
var app = express();
var PORT = process.env.PORT || 8080;

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

app.use(express.static('./'));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html')) 
});

app.get('/geocode', function(req, res) {

  var options = {
    url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + req.query.address + '&api_key=' + process.env.GEOCODE_API_KEY,
    json: true
  };

  request(options, function(err, resp, body) {
    res.send(body);
  });

});

app.get('/search', function(req, res) {
  // var options = {
  //   url: 'https://api.yelp.com/v3/businesses/search?term=' + req.query.term + '&latitude=' + req.query.lat + '&longitude=' + req.query.lng,
  //   headers: {
  //     'Authorization': 'Bearer ' + process.env.YELP_ACCESS_TOKEN
  //   },
  //   json: true
  // };

  var options = {
    url: 'https://api.yelp.com/v3/businesses/search?term=' + req.query.term + '&latitude=' + req.query.lat + '&longitude=' + req.query.lng,
    headers: {
      'Authorization': 'Bearer ' + 'Dc0cWxN91fsh9SBGnRKaCUvIRasEhBJDwzYIx6gaIKcGz36YXj-aU7L9tB9w7NDEtlCphDk48MZIAbUW8cHyfKfxCE0ifGrewI-qqsls7qdrp13jTua72G6MqL-eWXYx'
    },
    json: true
  };

  request(options, function(err, resp, body) {
    if (err) {
      res.send(err)
    }
    res.send(body);
  });
});

app.listen(PORT, function() {
  console.log('App listening on port: ' + PORT);
});