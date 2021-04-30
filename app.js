var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const mongoose = require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var flash =  require('connect-flash');
var passport = require('passport');
var expressHandle =require('express-handlebars');
var app = express();
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const Handlebars = require('handlebars')
const user = require('./model/user_model');
mongoose.connect('mongodb://localhost/shopping',{useUnifiedTopology:true,useNewUrlParser:true,createIndexes:true},(err)=>{
  if(err){
    console.log(err);
  return;
  }

console.log("connected!!")
});
require('./config/passport');
// view engine setup hbs.engine
app.engine('hbs',expressHandle({
  defaultLayout: 'layout', 
  extname: 'hbs',
  layoutsDir:__dirname + '/views/layouts',
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers : {
    add:function(value){
      return value + 1;
    },
    multi:(quantity,price)=>{
      return quantity * price;
    },
    checkAdminOrUser:function(value){
      if(value == '2'){
        console.log("Admin------------------------------------");
      return true;}
      else{
        return false;
      }
    }
  }

}));
app.set('view engine', 'hbs');
app.set('views', 'views');
/*app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');*/
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({secret:"tamween-minister#12#&!",saveUninitialized:false,resave:true}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
 // next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
