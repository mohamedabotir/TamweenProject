const mongoose = require('mongoose');
const cartSchema = mongoose.Schema({
_id:{
    type:String,
    require:true
},
totalQuantity:{
    type:Number,
    required:true
},
orderDate:{
    type:Date,
    default:Date.now
},
totalPrice:{
    type:Number,
    required:true
},
products:{
type:Array,    
required:true
}
});
module.exports = mongoose.model('cart',cartSchema);