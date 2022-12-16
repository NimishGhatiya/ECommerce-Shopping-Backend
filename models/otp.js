const mongoose=require('mongoose')
const  otpSchema=new mongoose.Schema({
    email:{
        type:String,
        lowercase:true
    },
    otp:String,
    expireIn:Number
},{
    timestamps:true
})

let Otp=mongoose.model('otp',otpSchema)

module.exports=Otp