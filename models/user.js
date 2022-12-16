const mongoose=require('mongoose')
const Joi=require('joi')
const jwt=require('jsonwebtoken')
const uniqueValidator = require('mongoose-unique-validator');
const validator=require('validator')


const UserSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        minlength:5,
        maxlength:30,
        trim:true
    },
    lastname:{
        type:String,
        required:true,
        minlength:5,
        maxlength:30,
        trim:true
    
    },
    email:{
        type:String,
        required:true,  
        unique:true ,   
        validate(value){
            if (!validator.isEmail(value)) {
                throw  Error("email  is invalid");    
            }
        }
    },
   
    phone:{
      
        type:Number,
        required:true,  
        unique:true,      
        validate(value){
             if (value.toString().length<10 ||value.toString().length>10) {
           throw console.error("phone no. is incorrect");  
           }
        }
    }, 
    
    password:{
        type:String,
        required:true,
        minlength:5
    },
    confirmPassword:{
        type:String,
        required:true,
        minlength:5
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
   
},{timestamps:true})


UserSchema.methods.genAuthToken=function(){
    const token=jwt.sign({_id:this._id,role:this._role},'jwtPrivateKey')
    return token
}

UserSchema.plugin(uniqueValidator);
 
const User=mongoose.model('User',UserSchema)


function Uservalidate(data){
    const schema=Joi.object({
        firstname:Joi.string().min(5).max(30).required(),
        lastname:Joi.string().min(5).max(30).required(),
        email:Joi.string().min(5).max(30).lowercase().required().email(),
        phone:Joi.number().required(),
        password:Joi.string().min(5).required(),
        confirmPassword:Joi.string().min(5).required(),
        isAdmin:Joi.boolean()
    })
    return schema.validate(data)
}

exports.User=User
exports.Uservalidate=Uservalidate