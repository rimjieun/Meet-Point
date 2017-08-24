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

app.get('/search', function(req, res) {

  console.log(req.body);

  var options = {
    url: 'https://api.yelp.com/v3/businesses/search?term=cafe&latitude=33.893793147220464&longitude=-84.15886765214833',
    headers: {
      'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN
    }
  };

  request(options, function(err, resp, body) {
    res.send(body);
  });
});

app.listen(PORT, function() {
  console.log('App listening on port: ' + PORT);
});