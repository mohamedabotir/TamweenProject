const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const user = require('../model/user_model');
const userCart = require('../model/cart');
const validator  = require('express-validator');
passport.serializeUser((user,done)=>{
  return done(null,user.id);
});
passport.deserializeUser((id,done)=>{
  user.findById(id,('name role ssn balance personno address credit'),(err,result)=>{
    //console.log(result);
    userCart.findById(id,(err,cart)=>{
      if(!cart){
        done(err,result);
      }
      result.cart = cart;
      return done(err,result)
    });

  });
});
//passport.deserializeUser(());
passport.use('local-signin',new localStrategy({
usernameField: 'cardno',
passwordField: 'code',
passReqToCallback: true
},(req,cardno,code,done)=>{
  
    user.findOne({cno:cardno},(err,result)=>{
        
        if(err){
            return done(err);
          } 
        if(!result)
          {
              return done (null,false,req.flash('signin-error','not found-user'));
           }
          if(!result.compareCode(code)){
            //console.log("error");
            return done(null,false,req.flash('singin-error','Match Enter Correct Data'));
          }
          var  today = new Date();
          if(today.getDate()=="01" && (today.getHours()=="12" && (today.getSeconds(1)))){
            result.balance = result.personno * 50;
            user.updateOne({_id:result._id},{$set : result},(err,doc)=>{
              if(err){
              console.log(err);
            return;
            }
            console.log(doc)
            })
            return done(null,result);
          }
          console.log(result);
          return done(null,result);
    })
}));
/*passport.use('local-createUser',new localStrategy({
  usernameField : 'cno',
  passwordField : 'code',
  passReqToCallback: true
  },(req,cno,code,done)=>{
   
    user.findOne({cno:cno},(err,result)=>{
      if(err)
      return done(err);
      console.log(result)
      if(result){ 
        console.log('hhhhhhhhhhh')
        return done(null,false,req.flash('createUserError','this user Already Exist'));
      }
      const u = new user({
        cno:req.body.cno,
        ssn:req.body.ssn,
        address:[req.body.gov,req.body.state,req.body.ne],
        name:req.body.name,
        code:new user().PasswordHash(req.body.code),
        personno:req.body.personno,
        balance:parseInt(req.body.personno)*50
      });
      u.save((err,result)=>{
        if(err)
        return done(err);
        console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhh'+result)
        return done(null,result);
      });
    });
  }));*/
  /*
   cno:req.body.cno,
        ssn:req.body.ssn,
        address:[req.body.gov,req.body.state,req.body.ne],
        name:req.body.name,
        code:new user().PasswordHash(req.body.code)
  */