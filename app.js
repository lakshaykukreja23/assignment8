var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var path = require('path');
var mongoose = require('mongoose');
var session = require('express-session');
var fs = require('fs');

app.use(logger('dev'));

app.use(bodyParser.json({limit:'10mb',extended:true}));
app.use(bodyParser.urlencoded({limit:'10mb',extended:true}));
app.use(cookieParser());
//saving the session
app.use(session({
		name : "myCookies",
		secret : "ecommerceCookie",
		httpOnly : true,
		resave: true,
		saveUninitialized : true,
		cookie : {
			secure: false
	}
}));
// configuring the ejs template view 
app.set('view engine','ejs'); 
app.set('views', path.join(__dirname + '/app/views'));

 var dbPath = "mongodb://localhost/ecommerceApp";
 db = mongoose.connect(dbPath);
 mongoose.connection.once('open',function()
 {
 	console.log('connection build with the mongodb');
 }) ;
// reading the file 
 fs.readdirSync('./app/models').forEach(function(file)
 {	
 	if(file.indexOf('.js'))
 	{
 		require('./app/models/'+file);
 	}

 });
 fs.readdirSync('./app/controllers').forEach(function(file)
 {
 	if(file.indexOf('.js'))
 	{
 		var route = require('./app/controllers/'+file);
		route.controllerFunction(app);
 	}
 });
var myMiddlewares = require('./middlewares/auth');
var userModel = mongoose.model('User');

app.use(function(request,response,next){
	if(request.session && request.session.user){
		userModel.findOne({
			'email' : request.session.user.email
		}, 
		function(error, user){
			if(user){
				request.user = user;
				delete request.user.password;
				request.session.user = user;
				next();
			}
			else{
				console.log(error);
			}
		});
	}
	else{
		next();
	}
});
// handling the wrong paths
app.get('*', function(request, response, next) {

    response.status = 404;
    next("Page not found. Please enter a valid URL");
});

//error handling middleware
app.use(function(error, request, response, next) {

    console.log("Error handler used");

    if (response.status == 404) {
        response.send("please check the url , I think u had entered it wrong ");
    } else {
        response.send(error);
    }
});
 app.listen(3000,function()
 {
 	console.log('listening to the port number 3000');
 })