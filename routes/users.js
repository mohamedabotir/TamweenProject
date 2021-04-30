var express = require('express');
const validator  = require('express-validator');
var router = express.Router();
const userController = require('../controller/user'); 
const passport = require('passport');
const user = require('../model/user_model');
var csrf = require('csurf');
/* GET users listing. */

router.use(csrf());

router.get('/',isNotSignin,userController.loginUser);
router.get('/dashboard',isSigin,userController.getDashboard);
router.get('/profile',isSigin,userController.getProfile);
router.post('/',[
    validator.body('cardno').not().isEmpty().withMessage('Pleas Fill Code field'),
    validator.body('cardno').isNumeric().withMessage('Card Numebr must be Numeric'),
    validator.body('cardno').isLength({min:12,max:12}).withMessage('Card Numebr must be 12 Number'),
    validator.body('code').not().isEmpty().withMessage('Pleas Fill Code field'),
    validator.body('code').isNumeric().withMessage('code Numebr must be Numeric'),
    validator.body('code').isLength({min:4,max:4}).withMessage('Code Numebr must be 4 Number'),

    ],(req,res,next)=>{
        const errors = validator.validationResult(req);
        if(!errors.isEmpty())
        {   
            console.log(errors);
            const ErrorsValidation = [];
            for (let index = 0; index < errors.errors.length; index++) {
                ErrorsValidation.push(errors.errors[index].msg);   
            }
            req.flash('signin-error',ErrorsValidation);
            res.redirect('/users');
            return;
    
        }
       //res.render('user/HomePage',{true})
     return next();
    },passport.authenticate('local-signin',{
        successRedirect:'/',
        failureFlash:'/users',
        failureFlash:true
    }));
//router.get('/allUser',userController.getAllUsers)
router.get('/createUser',isSigin,isAdmin,userController.getCreateUser)
router.post('/createUser',[
validator.body('cno').isNumeric().withMessage('please insert in Numeric Form '),
validator.body('cno').isLength({min:12,max:12}).withMessage('card number must be 12 Number'),
validator.body('ssn').isNumeric().withMessage('please insert in Numeric Form '),
validator.body('ssn').isLength({min:14,max:14}).withMessage('Social security Number must be 14 Number'),
validator.body('code').not().isEmpty().withMessage('please Enter Code '),
validator.body('code').isLength({min:4,max:4}).withMessage('code must be 4 number')
],(req,res,next)=>{
    const u = new user({
        cno:req.body.cno,
        ssn:req.body.ssn,
        address:[req.body.state,req.body.gov,req.body.ne],
        name:req.body.name,
        code:new user().PasswordHash(req.body.code),
        personno:req.body.personno,
        role:parseInt(req.body.role,10),
        balance:parseInt(req.body.personno,10)*50
      });
      u.save((err,result)=>{
        if(err){
        console.log(err)
    req.flash('errorCreate','please enter Correct data');
    
    return res.redirect('/users/createUser');
    }
        console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhh'+result)
        res.redirect('/');
      });
    });
router.get('/logout',isSigin,userController.logout);
function isSigin(req,res,next){
    if(!req.isAuthenticated()){
    res.redirect('/users');
    return;
} console.log(req.isAuthenticated());
    return next();
}
function isNotSignin(req,res,next){
    if(req.isAuthenticated()){
        res.redirect('users/dashboard');
        return ;
    }
    next();
}
router.get('/cart',isSigin,userController.getcart);
function isAdmin(req,res,next){
    console.log(req.user.role)
    if(req.user.role == '2'){
        console.log('asdasdasdasdasdasd');
       next();
        return;
    }

    res.redirect('/');
    next();
}
router.get('/test',(req,res)=>{
console.log(test(req));
})
function test(req){
let address = req.user.address[0];

    return address;
}
module.exports = router;
/*


,[
validator.body('cardno').not().isEmpty().withMessage('Pleas Fill Code field'),
validator.body('cardno').isNumeric().withMessage('Card Numebr must be Numeric'),
validator.body('code').not().isEmpty().withMessage('Pleas Fill Code field'),
validator.body('code').isNumeric().withMessage('code Numebr must be Numeric')
],
*/