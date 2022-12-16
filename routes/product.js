const {createProduct,updateProduct,deleteProduct,FindAllProduct,FindProduct,FindlatestProduct}=require('../controller/productcontroller')
const {verifyTokenAndAdmin}=require('../middleware/auth')
const Express=require('express')
const router=Express.Router()

//CRETAE PRODUCT
router.post('/createProduct',verifyTokenAndAdmin,createProduct)

//UPDATE
router.put('/updateproduct/:id',verifyTokenAndAdmin,updateProduct)
router.delete('/deleteproduct/:id',verifyTokenAndAdmin,deleteProduct)

router.get('/findproduct/:id',FindProduct)
router.get('/findallproduct',FindAllProduct)
router.get('/findlatestproduct',FindlatestProduct)//CATEGORY FIND


module.exports=router
