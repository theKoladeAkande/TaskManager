var express = require('express');
var path    = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var redis = require('redis');
var app = express();

//Client
var client = redis.createClient();

client.on('connect', function(){
    console.log('Redis server started');
});

// setup view engine
app.set('views', path.join(__dirname,'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(request, response){
    var title = 'Task List';

    client.lrange('tasks',0, -1, function(err, reply){
        response.render('index',{
            title: title,
            tasks: reply 

   });// response.render 
    });//client.lrange 

    
   
}); // app.get 


app.post('/task/add', function(request,response){
    var task = request.body.task;
    client.rpush('tasks', task, function(err, reply){
        if (err){
            console.log(err);
        }//if

        console.log('Task Added');
        response.redirect('/');

    });//client.rpush
});//app.post

// start server
app.listen(3000);
console.log('This server is started on port 3000');
module.exports = app;