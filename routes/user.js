const {Userregister,Userlogin,emailSend,forgetPassword,updateUser,resetpassword,deleteUser,FindUser,FindAllUser,FindlatestUser}=require('../controller/Usercontroller')
const {verifyToken,verifyTokenAndAdmin}=require('../middleware/auth')
const Express=require('express')
const router=Express.Router()


router.post('/register',Userregister)
router.post('/login',Userlogin)
router.post('/email-send',emailSend)
router.post('/forget-password',forgetPassword)
router.put('/user-update',verifyToken,updateUser)
router.put('/reset-password',verifyToken,resetpassword)
router.delete('/delete',verifyToken,deleteUser)
router.get('/find',verifyTokenAndAdmin,FindUser)
router.get('/findalluser',verifyTokenAndAdmin,FindAllUser)
router.get('/findlatestuser',verifyTokenAndAdmin,FindlatestUser)

module.exports=router


