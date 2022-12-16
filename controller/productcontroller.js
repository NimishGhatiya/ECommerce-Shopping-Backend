const Product=require('../models/product')
const { resetpassword } = require('./Usercontroller')
const {User}=require('../models/user')


//create product by Admin 
module.exports.createProduct=async(req,res)=>{

    try{
        let product=await User.findOne(req.user)
        if(!product)return res.status(404).json('Admin token not found')

         product=new Product(req.body)
        const savedProduct=await product.save()
         res.status(201).json(savedProduct)
    }catch(error){
        res.status(500).send(error.message)
    }
}

//udpate product by Admin using id

module.exports.updateProduct=async(req,res)=>{
    try{
        let product=await User.findOne(req.user)
        if(!product)return res.status(404).json('Admin token not found')

        product=await Product.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        if(!product)return res.status(404).json('Product-ID not found')

        res.status(200).json(product)
    }catch(error){
        res.status(500).send(error.message)
    }
}


//delete product by Admin using id

module.exports.deleteProduct=async(req,res)=>{
        try{

            let product=await User.findOne(req.user)
            if(!product)return res.status(404).json('Admin token not found')

          product=await Product.findByIdAndDelete(req.params.id)
          if(!product)return res.status(404).json('Product-ID not found')

        res.status(200).json('product delete successfully')
        }catch(error){
            res.status(500).message(error.message)
        }
}



//find unique product by id
module.exports.FindProduct=async(req,res)=>{
try{

    let product=await Product.findById(req.params.id)
    if(!product)return res.status(404).json('Product-ID not found')
    res.status(200).json(product)
}catch(error){
    res.status(500).message(error.message)
}
}

//find all product
module.exports.FindAllProduct=async(req,res)=>{
try{
    let product=await Product.find()
    res.status(200).json(product)
}catch(error){
    res.status(500).message(error.message)
}
}


//find latest product
//find category product
module.exports.FindlatestProduct=async(req,res)=>{
    const qNew=req.query.new
    const qCategory=req.query.category
   try{
        let products

        if(qNew){
            products=await Product.find().sort({createdAt:-1}).limit(1)
        }else if(qCategory){
            products=await  Product.find({categories:{
                $in:[qCategory]
            }
        })
        }else{
            products=await Product.find()
        }
     
        res.status(200).json(products)

   }catch(error){ 
    res.status(200).send(error.message)
   }
}
