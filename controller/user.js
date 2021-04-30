const user = require('../model/user_model');
const validator  = require('express-validator');
const cartModel = require('../model/cart');
module.exports.postUser = (req,res,next)=>{
    
    const errors = validator.validationResult(req);
    if(!errors.isEmpty())
    {   
        console.log(errors);
        const ErrorsValidation = [];
        for (let index = 0; index < errors.errors.length; index++) {
            ErrorsValidation.push(errors.errors[index].msg);   
        }
        req.flash('createUserError',ErrorsValidation);
        res.redirect('/users/createUser');
        return;

    }
    console.log("asdsdsadaddadad");
   next();
}
module.exports.loginUser = (req,res,next)=>{
    res.setHeader('Conten-Type','text/html');
    const errorMessage = req.flash('signin-error');
    const token = req.csrfToken();
    console.log(token);
    //res.cookie('csrf-token',token);
    res.render('user/signin',{errors :errorMessage ,token:token});
}
module.exports.getDashboard = (req,res,next)=>{
    console.log('asddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd');
    res.render('user/homepage',{status:true});
}
module.exports.getProfile = (req,res,next)=>{
    console.log(req.user);
res.render('user/profile',{user:req.user});
}
module.exports.logout=(req,res,next)=>{
    
    req.logout();
    req.session.destroy();
    res.redirect('/');
}
module.exports.getcart = (req,res,next)=>{
    if(!req.user.cart){
        res.redirect('/');
        return;
    }
    const cart = req.user.cart;
    if(req.user.role == "1")
           res.render('user/ShoppingCart',{cart:cart,user:true});
           else
           res.render('user/ShoppingCart',{cart:cart});
     }
   module.exports.getCreateUser = (req,res,next)=>{
       const token = req.csrfToken();
       console.log(token);
       console.log('-------------------------------------------------------------');
       const error = req.flash('errorCreate');
       console.log(error);
res.render('admin/createUser',{token:token,error:error});
   }
/*
let Productno=[];
    Productno.push(cart.products[0].date)
     for(let i=1 ;i<cart.products.length;i++){ 
             
                    Productno.push(cart.products[i].date);
                
                }
              
             
                console.log(Productno);
          for(let i = 0;i<Productno.length;i++){
              for(let z=1;z<Productno.length;z++){
                  if(Productno[i]==Productno[z]){
                      Productno.splice(i,1);
                  }
              }
          }
          let temp =[];
           for (let i = 0; i < cart.products.length; i++) {
               for(let z=0;z<Productno.length;z++){
               if(cart.products[i].date == Productno[z])
                temp.push(cart.products[i]);
                
            }
            
           }
          console.log(Productno);
          console.log(temp);
* */