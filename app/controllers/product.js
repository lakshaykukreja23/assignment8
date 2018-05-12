var express = require('express');
var mongoose = require('mongoose');
var uid = require('uniqid');

var productRouter = express.Router();

var userModel = mongoose.model('User');
var productModel = mongoose.model('Product');

var responseGenerator= require('./../../libs/responseGenerator');

module.exports.controllerFunction = function(app){
    //getting all the products
	productRouter.get('/all',function(req,res)
	{
		productModel.find(function(error,result)
		{
			if(error)
			{
				var response= responseGenerator.generate(true, 'Some error occured',500, null)
				res.send(response);
			}
			else
			{
				var response= responseGenerator.generate(false, 'your result is ass follow',200, result)
				res.send(response);
			}
		});
	});

	productRouter.get('/createproduct/screen',function(req,res)
	{
		res.render('createproduct');
	})
    //createing the product 
	 productRouter.post('/create', function(req,res){
        // checking if the information is valid or not 
        if(req.body.productName != undefined && req.body.productPrice != undefined && req.body.productDescription != undefined && req.body.sellerName != undefined && req.body.sellerAddress != undefined && req.body.sellerContactNumber != undefined && req.body.deliveryTime != undefined){

            var newProduct = new productModel({
                productId: uid(),
                productName: req.body.productName,
                productPrice: req.body.productPrice,
                productDescription: req.body.productDescription,
                deliveryTime : req.body.deliveryTime
            });

            var sellerDetails = {
                'sellerName': req.body.sellerName,
                'sellerAddress': req.body.sellerAddress,
                'sellerMobileNumber': req.body.sellerMobileNumber
            };

            newProduct.productSeller = sellerDetails;

            var categories = (req.body.productCategory != undefined && req.body.productCategory != null) ? req.body.productCategory.split(',') : '';

            newProduct.productCategory = categories;
            //saving the information
            newProduct.save(function(err){
                if(err){
                    var errorResponse = responseGenerator.generate(true,'Please, Fill the require details.', 500, null);
                    res.render('error',{
                        message: errorResponse.message,
                        status: errorResponse.status
                    });
                }
                else{
                    var successRes = responseGenerator.generate(false, 'Product hase been created.', 200, newProduct);
                    res.send(successRes);
                }
            });

        }
        else{
            var errorResponse = responseGenerator.generate(true, 'Please, Fill the require details.', 500, null);
            res.send(errorResponse);
        }
    });
        //finding product by id
	     productRouter.get('/:productId/find', function(req,res){
        productModel.findOne({'productId': req.params.productId},function(error, foundProduct){
            
            if(error){
            	 var errorResponse = responseGenerator.generate(true,'no product exist with such id', 500, null);
                res.send(errorResponse);
                }
            else{
                 var response = responseGenerator.generate(false, 'found the product ', 200, foundProduct);
                res.send(response);
            }
        });
    });
	productRouter.get('/delete/screen', function(req, res){
        res.render('deleteproduct');
    });
    //deleting product 
    productRouter.post('/delete', function(req, res){
        productModel.findOneAndRemove({productId: req.body.productId}, function(error,result){
            if(result){
            	
                 var response = responseGenerator.generate(false, 'Product deleted successfully', 200, result);
                res.send(response);
				}
            else{
               var errorResponse = responseGenerator.generate(true, 'Product not found', 500, null);
                res.send(errorResponse);
                
            }
        });
    });
    //editing the product 
  productRouter.put('/edit',function(req,res)
{
	var update = req.body;
	blogApp.findOneAndUpdate({'productId':req.params.productId},update,function(err,result)
	{
		if(err)
		{
			var errorResponse = responseGenerator.generate(true, 'some error occured', 500, err);
                res.send(errorResponse);
		}
		else
		{
			var response = responseGenerator.generate(false, 'product updated successfully', 200, result);
                res.send(response);
		}
	});
});
	app.use('/products',productRouter);
}
