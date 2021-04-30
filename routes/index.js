var express = require('express');
var router = express.Router();
const product = require('../controller/products');
const users = require('../model/user_model');
const products = require('../model/product_model');
const multer = require('multer');
const validator = require('express-validator');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
});
 
var upload = multer({
    storage: storage,
    limits:{
        fieldSize:1024*1024*4
    } 

})
router.get('/products',isSigin,isAdmin,(req,res,next)=>{
    res.render('uploadProducts');
});
router.post('/postProduct',upload.single('file'),(req,res,next)=>{
    console.log(req.file);
    let data;
    if(req.user.role == '2')
    data = new products ({
        price:parseInt(req.body.price),
        name:req.body.proname,
        quantity:parseInt(req.body.quantity),
        information:req.body.information,
        imagepath: req.file.filename
    })
    else if(req.user.role == '1')
     data = new products ({
        price:parseInt(req.body.price),
        name:req.body.proname,
        quantity:parseInt(req.body.quantity),
        information:req.body.information,
        imagepath: req.file.filename,
        productOwner: req.user._id
    })
    data = data.save((err,doc)=>{
if(err)
console.log(err);
res.redirect('/products');
return;
    });  
     
});
router.get('/remove',(req,res,next)=>{
    products.deleteMany((err,doc)=>{
        if(err)
        console.log(err);
        console.log(doc);
    });
})
/* GET home page. */
router.get('delete',(req,res,next)=>{
users.deleteMany((err,doc)=>{
if(err)
console.log(err);
console.log(doc);
})
});
router.get('/',product.index);
/*Post Product Test*/
router.post('/product',product.postProduct);
/*Delete all products*/
router.get('/delete',product.delete);
/*update specific product*/
router.post('/update',product.update);
router.get('/addtocart/:id/:price/:name',isSigin,product.addProduct);
function isAdmin(req,res,next){
    console.log(req.user.role)
    if(req.user.role == '2'||req.user.role=='1'){
        console.log('asdasdasdasdasdasd');
       next();
        return;
    }

    res.redirect('/');
    next();
}

function isSigin(req,res,next){
    if(!req.isAuthenticated()){
    res.redirect('/users');
    return;
} console.log(req.isAuthenticated());
     next();
}
module.exports = router;
