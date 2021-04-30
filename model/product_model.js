const mongoose = require('mongoose');
const producSchema = mongoose.Schema({
name:{
    type:String,
    required:true
},
quantity:{
    type:Number,
    required:true
},
information:{
    type:String,
    required:true,
    max:20

},
imagepath:{
    type:String,
    required:true,
    //ContenType:String,
    //default:'non-image'
},
productOwner:{
type:String,
default:'minister',
required:true
},
price:{
    type:Number,
    required:true
}
});
module.exports = mongoose.model('product',producSchema);