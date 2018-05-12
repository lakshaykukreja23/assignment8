var mongoose = require('mongoose');
var express = require('express');

var userRouter = express.Router();
var userModel = mongoose.model('User');
var productModel = mongoose.model('Product');
var responseGenerator = require('./../../libs/responseGenerator');
var auth = require("./../../middlewares/auth");

module.exports.controllerFunction = function(app){
    // getting all the user details 
	userRouter.get('/all',function(req,res)
	{
		userModel.find(function(error,all)
		{
			if(error)
			{
				res.send(error);
			}
			else
			{
				res.send(all);
			}
		});
	});
    //opening ejs view for signup
	userRouter.get('/signup/screen',function(req,res)
	{
		res.render('signup');
	});
	userRouter.post('/signup',function(req,res)
	{
        //checking the data
		if(req.body.firstName!=undefined && req.body.lastName!=undefined && req.body.email!=undefined && req.body.password!=undefined && req.body.mobileNumber!=undefined && req.body.securityAnswer!=undefined){
			var newUser = new userModel({
                userName            : req.body.firstName+''+req.body.lastName,
                firstName           : req.body.firstName,
                lastName            : req.body.lastName,
                email               : req.body.email,
                mobileNumber        : req.body.mobileNumber,
                password            : req.body.password,
                securityAnswer		: req.body.securityAnswer

            });
            //finding either already exist 
			userModel.findOne({'email': req.body.email}, function(err, result){
                if(result){
                    var errRes = responseGenerator.generate(true, 'Email ID is already Exist', 500, null);
                    res.send(errRes);
                }
                else{
            newUser.save(function(error){
                if(error){
                   res.render('error', {
                    message: myResponse.message,
                    error: myResponse.data
                   });

                }
                else{
                   req.session.user = newUser;
                   delete req.session.user.password;
                   res.redirect('/users/dashboard')
                }

            });
            }
            });//end new user save


        }
        else{

            var myResponse = {
                error: true,
                message: "Some body parameter is missing",
                status: 403,
                data: null
            };

             res.render('error', {
                     message: myResponse.message,
                   error: myResponse.data
              });

        }
        

    });
    //login view 
    userRouter.get('/login/screen',function(req,res)
    {
    	res.render('login');
    })
	userRouter.post('/login',function(req,res)
	{
        //finding the user
		userModel.findOne({$and:[{'email':req.body.email},{'password':req.body.password}]},function(error,foundUser)
		{
			if(error){
                var myResponse = responseGenerator.generate(true,"some error"+err,500,null);
                res.send(myResponse);
            }
            //checking if any info is undefined
            else if(foundUser==null || foundUser==undefined || foundUser.userName==undefined){

                var myResponse = responseGenerator.generate(true,"user not found. Check your email and password",404,null);
              
                res.render('error', {
                  message: myResponse.message,
                  error: myResponse.data
                });

            }
            else{
                //when user found 
                  req.session.user = foundUser;
                  delete req.session.user.password;
                  res.redirect('/users/dashboard')

            }

		});
	});
    //main page of the app
	userRouter.get('/dashboard', auth.checkLogin, function(req,res){
		res.render('dashboard',{user: req.session.user });
		});
//change password view
	userRouter.get('/changepassword/screen',auth.checkLogin,function(req,res)
	{
		res.render('changepassword');
	});
	userRouter.post('/changepassword',function(req,res)
	{ //checking the password entered 
		if(req.body.newPassword != req.body.retypeNewPassword)
		{
			var passwordNotMatch = responseGenerator.generate(true,'password doesnot match please re-enter the password',500,null);
			res.send(passwordNotMatch);
		}
		else 
		{
            //updating the password
			var newPassword = req.body.newPassword ;
			userModel.findOneAndUpdate({$and:[{'email':req.session.user.email},{'password':req.body.oldPassword}]},{$set:{password:newPassword}},{new:true},function(error,foundUser)
			{
				if(error){
                    var errorRes = responseGenerator.generate(true, 'Some error occured',500, null);
                    res.send(errorRes);
                }
                else if(foundUser == undefined || foundUser.email == undefined || foundUser.password == undefined){
                    var errorRes = responseGenerator.generate(true, 'check your password', 500, null);
                    res.render('error',{
                        message: errorRes.message,
                        status: errorRes.status
                    });
                }
                else{
                    req.session.user = foundUser;
                    delete req.session.user.password;

                    var passwordChange = responseGenerator.generate(false, 'Password change successfully', 200, foundUser);
                    res.send(passwordChange);
                }
			});
		}
	});
    //deleting the user scren 
       userRouter.get('/userdelete/screen', function(req, res){
        res.render('userDelete'); 
    });

    // access data from userDelete.ejs page
    userRouter.post('/deleteUser', function(req, res){
        userModel.findOneAndRemove({userId: req.body.userId}, function(err, success){
            if(success){
                var successRes = responseGenerator.generate(false, 'User deleted successfully', 200, success);
                res.send(successRes);
            }
            else{
                var errRes = responseGenerator.generate(true, 'User not Found', 500, null);
                res.send(errRes);
            }
        });
    });

	userRouter.get('/forgotpassword/screen',function(req,res)
	{
		res.render('forgotpassword');
	});
	userRouter.post('/forgotpassword/change',function(req,res)
	{  
        //checking new entered pasword 
		if(req.body.newPassword != req.body.retypeNewPassword)
		{
			var passwordNotMatch = responseGenerator.generate(true,'password doesnot match please re-enter the password',500,null);
			res.send(passwordNotMatch);
		}
		else 
		{        
            //checking all the information entered is matching or not 
			var newPassword = req.body.newPassword ;
			userModel.findOneAndUpdate({$and:[{'email':req.body.email},{'mobileNumber':req.body.mobileNumber},{'securityAnswer':req.body.securityAnswer}]},{$set:{password:newPassword}},{new:true},function(error,foundUser)
			{
				if(error){
                    var errorRes = responseGenerator.generate(true, 'Some error occured',500, null);
                    res.send(errorRes);
                }
                //either any information is undefined then showing error
                else if(foundUser == undefined || foundUser.email == undefined || foundUser.mobileNumber == undefined  || foundUser.securityAnswer== undefined){
                    var errorRes = responseGenerator.generate(true, 'check your password', 500, null);
                    res.render('error',{
                        message: errorRes.message,
                        status: errorRes.status
                    });
                }
                else{
                    req.session.user = foundUser;
                    delete req.session.user.password;

                    var passwordChange = responseGenerator.generate(false, 'Password updated  successfully', 200, foundUser);
                    res.send(passwordChange);
                }
			});
		}
	});
	userRouter.get('/addtocart/screen',auth.checkLogin,function(req,res)
    {
        res.render('addtocart');
    });
    userRouter.post('/cart/add', function(req, res){
        var productId = req.body.productId;
            //finding the product 
        productModel.findOne({'productId': productId}, function(err,productFound){
            if(productFound){
                //checking wheter it already exist or not 
                userModel.findOne({$and: [{'email': req.session.user.email}, {'cart.productId': productId}]}, function(err,productFoundInCart){
                    if(productFoundInCart){
                        var errorResponse = responseGenerator.generate(true, 'Product already added to your cart',200,null);
                        res.send(errorResponse);
                    }
                    //pushing the product into the cart
                    else{
                        var createCart ={'cart': productFound};
                        userModel.findOneAndUpdate({'email': req.session.user.email}, {$push: createCart},function(err,success){
                            if(err){
                                var errorResponse = responseGenerator.generate(true, 'some Error occured', 500, null);
                                res.send(errorResponse);
                            }
                            else{
                                var successResponse = responseGenerator.generate(false, 'Product has been added to the cart', 200, success);
                                res.send(successResponse);
                            }
                        });
                    }
                });
            }
            else{
                var errorResponse = responseGenerator.generate(true, 'Product ID not found', 500, null);
                res.send(errorResponse);
            }
        });
    });
      userRouter.get('/removefromcart/screen', auth.checkLogin, function(req,  res){
        res.render('removefromcart'); 
    });
    userRouter.post('/removefromcart', function(req, res){
        var productsId = req.body.productId;
        //finding whether there is product of such id in the cart 
        productModel.findOne({'productId': productsId}, function(err,foundProduct){
            if(foundProduct){
                var removeCart = {
                    'cart': {
                        'productId': productsId
                    }
                };
                //removing from the cart if exist 
                userModel.findOne({$and:[{'email': req.session.user.email}, {'cart.productId': productsId}]}, function(err, productFoundInCart){
                    if(productFoundInCart){
                        userModel.update({'email': req.session.user.email}, {$pull: removeCart}, function(err, success){
                            if(success){
                                var response = responseGenerator.generate(false, 'Product successfully removed from your cart', 200, success);
                                res.send(response);
                            }
                        });
                    }else {
                        var errorResponse = responseGenerator.generate(true, 'This Product is not in you cart', 500, null);
                        res.send(errorResponse);
                    }
                });
            }
            else{
                var errorResponse = responseGenerator.generate(true, 'Product ID does not exist', 500, null);
                res.send(errorResponse);
            }
        });
    });

    //showing all the products in the cart 
    userRouter.get('/allcart', auth.checkLogin, function(req, res){
        userModel.find({'email': req.session.user.email}, function(error, allProducts){
            if(error){
                var errRes = responseGenerator.generate(true, 'Your cart is empty', 204, null);
                res.send(errRes);
            }
            else if(allProducts[0].cart){
                var successRes = responseGenerator.generate(false, 'All products', 200, allProducts[0].cart);
                res.send(successRes);
            }
            else{
                var errRes = responseGenerator.generate(true, 'Your cart is empty',204, null);
                res.send(errRes);
            }
        });
    });
    //logging out when everything is done
    userRouter.get('/logout', function(req, res){
        req.session.destroy(function(err){
            res.redirect('/users/login/screen');
        });
    });
		  app.use('/users', userRouter);
}


