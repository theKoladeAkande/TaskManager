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
        client.hgetall('call', function(err,call){
            response.render('index',{
                title: title,
                tasks: reply,
                call: call
    
       });// response.render 

        });//client.hgetall
        
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

app.post('/task/delete', function(request, response){
    var delTask = request.body.tasks;

    client.lrange('tasks', 0, -1, function(err,tasks){
        for(var i = 0; i< tasks.length;i++){
            if(delTask.indexOf(tasks[i]) >- 1){
                client.lrem('tasks', 0, tasks[i], function(){
                    if(err){
                        console.log(err);
                    }
                });

            }//if-statement

        }// for loop
        response.redirect('/');
    });// client.lrange

});//app.post




app.post('/call/add', function(request, response){
    var newCall = {};

    newCall.name = request.body.name;
    newCall.location = request.body.location;
    newCall.phone = request.body.phone;
    newCall.time = request.body.time;

    client.hmset('call', ['name', newCall.name,'location',newCall.location,'phone', newCall.phone, 'time', newCall.time], function(err,reply){
           if(err){
               console.log(err);
           }  //if  
           console.log(reply);
           response.redirect('/');  


    });//client.hmset

});//app.post






// start server
app.listen(3000);
console.log('This server is started on port 3000');
module.exports = app;