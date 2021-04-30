const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
    cno:{
        type:Number,
        required:[true,'يجب ادخال رقم البطاقة'],
        unique:true
    },
    ssn:{
        type:Number,
        required:[true,'يجب ادخال الرقم القومي'],
        unique:true
    },
    address:{
        type:[String,String,String],//state , governorate , Neighborhood
        required:[true,'يجب ادخال العنوان']
    },
    name:{
        type:String,
        required:[true,'يجب ادخال الاسم'],
        min:[20,'يجب الا يقل عن 20 حرف'],
        max:[60,'يجب الا يزيد عن 60 حرف']
    },
    code:{
      type:String,
      required:[true,'يجب اداخال رقم سري'],
      
    },personno:{
        type:Number,
        required:[true,'يرجي ادخال عدد الافراد']
    },role:{
        type:Number,
        default:0
    },
    balance:{
        type:Number,
        default:0
    },
    credit:{
        type:Number,
        default:0
    }
});
userSchema.methods.PasswordHash = (password)=>{
return bcrypt.hashSync(password,bcrypt.genSaltSync(4),null);
}
userSchema.methods.compareCode = function(code){
return bcrypt.compareSync(code,this.code);
}
module.exports  = mongoose.model('user',userSchema);