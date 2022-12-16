const jwt=require('jsonwebtoken')


module.exports.verifyToken=function(req,res,next){
    const token=req.header('x-auth-token')
    if(!token)res.status(400).json('Token Not Provided')
    try{
        const decoded=jwt.verify(token,'jwtPrivateKey')
        req.user=decoded
        next()
    }catch(ex){
        res.status(400).json('Invalid Token')
    }
}




module.exports.verifyTokenAndAdmin=(req,res,next)=>{
    this.verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next()
        }
        else{
            res.status(401).json('you are not a Admin')
        }
    })
}
