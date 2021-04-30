const product = require('../model/product_model');
const cart = require('../model/cart');
const user = require('../model/user_model');
const validator = require('express-validator');
module.exports.postProduct = (req,res,next)=>{
    const pro = new product({
        name:req.body.name,
        quantity:req.body.quantity,
        information:req.body.information,
        imagepath:req.body.path,
        price:req.body.price
    });
    pro.save((err,doc)=>{
        if(err)
        {
            console.log(err);
            console.log(req.body.name);
            return;
        }
        console.log(doc);
        res.render('index');
    });
}
module.exports.delete = (req,res,nex)=>{
    product.deleteMany((err,result)=>{
        if(err)
        {
            console.log(err);
        return;
        }
        console.log(result);
    });
} 
module.exports.index = (req, res, next)=>{
    var totalProducts = null; 
    if(req.isAuthenticated()){
        if(req.user.cart){
            totalProducts = req.user.cart.totalQuantity;
        }
     }
    product.find({},(err,result)=>{
        if(err)
        {
            console.log(err);
            return;
        }
        var productCart = [];
        var rowCapacity = 3;
    for (let index = 0; index < result.length; index+=rowCapacity) {
        productCart.push(result.slice(index,index+rowCapacity));
    }
    let role = false;
        console.log(productCart);
        if(req.isAuthenticated()){
            if(req.user.role == '2'){
        res.render('index', { title: 'Tamween',products:productCart,AuthCheck:req.isAuthenticated(),
        totalQuantity : totalProducts,admin:true,buyCheck:req.flash('buyError')
    });
    return;
}
if(req.user.role == '1'){
    res.render('index', { title: 'Tamween',products:productCart,AuthCheck:req.isAuthenticated(),
    totalQuantity : totalProducts,user:true,buyCheck:req.flash('buyError')
});
return;
}
res.render('index', { title: 'Tamween',products:productCart,AuthCheck:req.isAuthenticated(),
totalQuantity : totalProducts,buyCheck:req.flash('buyError'),client:true
});
}
else
res.render('index', { title: 'Tamween',products:productCart,AuthCheck:req.isAuthenticated(),
totalQuantity : totalProducts
});
    });
  }
  module.exports.update = (req,res,next)=>{
      product.updateOne({_id : req.body.id},{
        name:req.body.name,
        quantity:req.body.quantity,
        information:req.body.information,
        imagepath:req.body.path,
        price:req.body.price
      },(err,result)=>{
          if(err){
              console.log(err);
              return;
          }
          console.log(result);
          res.json({result:result});
      });
  }
module.exports.addProduct = (req,res,next)=>{
   /* cart.deleteMany((err,result)=>{
        console.log(result)
    });*/
   /* const errors = validator.validationResult(req);
    if(!errors.isEmpty())
    {   
        console.log(req.query)
        req.flash('buyError','يجب ادخال الكمية ');
            res.redirect('/');

    }*/

    console.log("sasasddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd");
    const clientID = req.user._id;
    let temp;
    var  today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    const productPrice = parseInt(req.params.price,10);
    let value = req.query.quantity;
    if(value == '')
    {   console.log("-asdasdasdasdasds------------------------------ddddddddddddddddddddddd--");
        value=1;
    
    }
    const paidProduct = req.params.id;
    let paidFor = null;
    let credit = null;
    product.findById(paidProduct,(err,result)=>{
if(err)
{
    console.log(err);
}
if(result.productOwner=='minister'){

}else{
    paidFor = result.productOwner;
    credit = result.credit;
}
    })
    const newProduct = {
        _id:req.params.id,
        price: parseInt(value,10) *productPrice,
        name:req.params.name,
        quantity:parseInt(value,10),
        date:date,
        client:req.user.name,
        address:req.user.address[0]+"-"+req.user.address[1]+"-"+req.user.address[2]
    };
    cart.findById(clientID,(err,result)=>{
        console.log(req.user.balance,"---------------------------",parseInt(value,10) *productPrice );
                if(req.user.balance <parseInt(value,10) *productPrice)
        {
            console.log("errorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
           req.flash('buyError',` عفوا لايوجد رصيد كافي رصيدك الحالي  :${req.user.balance}جنية  `);
            
            return res.redirect('/');
        }else{
        if(err){
            console.log(err);
            return;
        }
        if(!result){
            comBuy(req,parseInt(value,10) *productPrice);
            if(paidFor!=null)
            addToSeller(paidFor,credit,parseInt(value,10) *productPrice)
            cart.updateOne({_id:clientID},{$set:result},(err,doc)=>{
                if(err)
                {
                    console.log(err);
                
                    return;
                }
                console.log(doc);
            })

            var newCart = new cart({
                _id:clientID,
                totalQuantity:parseInt(value,10),
                totalPrice:productPrice*parseInt(value,10),
                products:[newProduct]
            });
            newCart.save((err,result)=>{
                if(err){
                    console.log(err);
                    return ;
                }
                console.log(result);
            });
          } 
          if(result){
               let productIndex = -1;
               for (let i = 0; i < result.products.length; i++) {
                temp = result.products[i].date +  date;
                console.log(req.params.id+','+result.products[i]._id);
                console.log(req.params.id ==  result.products[i]._id);
                   if((req.params.id ==  result.products[i]._id)){
                    
                     if((result.products[i].date == date))
                    {
                        productIndex = i;
                        temp = result.products[i].date +  date;
                        console.log('lllllllllllllllllllllllllllllllllllllllll');

                        break;
                    }                    console.log('llllllllllllllllllllllllllllllllllllllllls');

                    

                   }
                   console.log('lllllllllllllllllllllllllllllllllllllllll');
                   console.log(result.products[i].date+'/'+ date);
                   console.log(+result.products[i].date.toString()=== date.toString() )
               }
               if(productIndex>=0){
                result.products[productIndex].quantity = result.products[productIndex].quantity + parseInt(value,10);
                result.products[productIndex].price = result.products[productIndex].price + parseInt(value,10) *productPrice;
                result.totalQuantity = result.totalQuantity + parseInt(value,10);
                result.totalPrice =  result.totalPrice + productPrice*parseInt(value,10);
                comBuy(req,parseInt(value,10) *productPrice);
                if(paidFor!=null)
                addToSeller(paidFor,credit,parseInt(value,10) *productPrice,newProduct)
                cart.updateOne({_id : clientID},{$set : result},(err,doc)=>{
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log(doc);
                    console.log(result);
                });
            
            }else{
                console.log('else----------------------------------------------------------- ' +result.totalQuantity)
                   //modify result to update it 
                result.totalQuantity = result.totalQuantity +  parseInt(value,10);
                result.totalPrice =  result.totalPrice +  parseInt(value,10) *productPrice;
                comBuy(req,parseInt(value,10) *productPrice);
                if(paidFor!=null)
                addToSeller(paidFor,credit,parseInt(value,10) *productPrice,newProduct)
                result.products.push(newProduct);
                cart.updateOne({_id : clientID},{$set : result},(err,doc)=>{
                    if(err){
                        console.log(err);
                        return;
                    }
                    console.log(doc);
                    console.log(result);
                });
               }
               
              
          } 
         // res.send('add this product To cart :  '+req.params.id +"            " +req.query.quantity);
        res.redirect('/users/cart');  
        }
          //console.log('no Cart Found');
    });

}
function comBuy(req,price){
    console.log(req.user.balance);
let balance = req.user.balance - price;
console.log(balance);
let id = req.user._id;
user.findById(id,(err,doc)=>{
if(err)
console.log(err);
doc.balance = doc.balance -price;
user.updateOne({_id:id},{$set : doc},(err,doc)=>{
    if(err){
    console.log(err);
return;    
}
    console.log(doc,"jjjjjjjjjj")
})
})
;
}
function addToSeller(sallerId,credit,paid,newProduct){
let paidPrice = credit+paid;
if(sallerId!=null){
    user.findById(sallerId,(err,doc)=>{
        console.log("asdadasa-----d-a-sd-asd-d-------------------",paid);
        if(err)
        console.log(err);
        doc.credit = doc.credit +paid;
        user.updateOne({_id:sallerId},{$set : doc},(err,doc)=>{
            if(err){
            console.log(err);
        return;    
        }

            console.log(doc,"-------------------------------------------------",doc.credit)
        })
        })
        cart.findById(sallerId,(err,result)=>{
            if(err)
            {console.log(err);
            return;
            }
            if(!result){
                var newCart = new cart({
                    _id:clientID,
                    totalQuantity:newProduct.totalQuantity,
                    totalPrice:newProduct.totalPrice,
                    products:[newProduct]
                });
                newCart.save((err,doc)=>{
                    if(err)
                    {
                        console.log(err)
                    return;
                    }
                    console.log(doc);
                });
            }
            if(result){
                result.products.push(newProduct);
                cart.updateOne({_id : sallerId},{$set : result},(err,doc)=>{
                    if(err)
                    {console.log(err);
                    result;
                }
                console.log(doc);
                });
            }
        });
        
}
}