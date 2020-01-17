var express = require('express');
var path    = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var redis = require('redis');
var app = express();

// setup view engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, response){
    response.send('Hello Worrld!')
});

// start server
app.listen(3000);
console.log('This server is started on port 3000');
module.exports = app;