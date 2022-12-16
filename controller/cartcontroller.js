const { func } = require('joi')
const Cart=require('../models/cart')
const {User}=require('../models/user')


//create cart
module.exports.createcart=async(req,res)=>{
    try{
        let cart=await User.findOne(req.user)
        if(!cart)return res.status(404).json('user token not found')

      if(req.user._id===req.body.userId){

        let newcart=new Cart(req.body)
            const savedcart=await newcart.save()
            res.status(200).json(savedcart)
     }
        else{
        res.status(200).json('UserId or Token Invalid')
        }
    }
    catch(error){
        res.status(500).send(error.message)
    }
}


//update cart by userId
module.exports.updatecart=async(req,res)=>{
    try{
        let cart=await User.findOne(req.user)
        if(!cart)return res.status(404).json('user token not found')
    
        if(req.user._id===req.params.userId){
    
        cart=await Cart.findOneAndUpdate({userId:req.params.userId},{$set:req.body},{new:true})
        if(!cart)return res.status(404).json('cart not found')
        res.status(200).json('cart update success')
        }else(
            res.status(404).json('userId or user-token Invalid')
        )
    

    }catch(error){
        res.status(500).send(error.message)
    }
}

//delete cart by userId
module.exports.deleteCart=async(req,res)=>{
        try{
            let cart=await User.findOne(req.user)
            if(!cart)return res.status(404).json('user token not found')
        
            if(req.user._id===req.params.userId){
    
                cart=await Cart.findOneAndDelete({userId:req.params.userId})
                if(!cart)return res.status(404).json('cart not found')

              res.status(200).json('cart delete success')
            }else{
                res.status(404).json('userId or user-token Invalid')
            }
         }catch(error){
              res.status(500).message(error.message)
        }
}


//find cart by userId
module.exports.FindUserCart=async(req,res)=>{

    try{
        let cart=await User.findOne(req.user)
        if(!cart)return res.status(404).json('user token not found')
    
        if(req.user._id===req.params.userId){

            cart=await Cart.findOne({userId:req.params.userId})
            if(!cart)return res.status(404).json('cart not found')

          res.status(200).json(cart)
        }else{
            res.status(404).json('userId or user-token Invalid')
        }
     }catch(error){
          res.status(500).message(error.message)
    }
}


//find  all cart by admin
module.exports.FindAllUserCart=async(req,res)=>{
try{
    let cart=await User.findOne(req.user)
    if(!cart)return res.status(404).json('Admin Token not found')

    let carts=await Cart.find()
    res.status(200).json(carts)
}catch(error){
    res.status(200).json(error.message)
}
}