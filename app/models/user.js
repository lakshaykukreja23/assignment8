 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;

 var userSchema = new Schema({
 	userName 		: {type:String,required:true},
 	firstName 		: {type:String,default:'',required:true},
 	lastName  		: {type:String,default:'',required:true},
 	mobileNumber	: {type:Number,default:'',required:true},
 	email     		: {type:String,default:'',required:true},
 	password   		: {type:String,default:'',required:true},
 	securityAnswer  : {type:String,required:true},
 	cart            : {}
 });

 mongoose.model('User',userSchema);