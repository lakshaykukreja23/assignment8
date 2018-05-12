var mongoose = require('mongoose');


var Schema = mongoose.Schema;

var productSchema = new Schema({

	productId              :  {type:String,default:'',required:true}, 
	productName            :  {type:String,default:'',required:true},
    productCategory        :  [], 
    productPrice           :  {type:String,default:'',required:true}, 
    productDescription     :  {type:String,default:'',required:true}, 
    productSeller          :  {},
    deliveryTime		   :  {type:Number,default:'', required:true}

});


mongoose.model('Product',productSchema);