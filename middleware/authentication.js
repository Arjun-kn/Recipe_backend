const jwt = require('jsonwebtoken');

let auth = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        // verify token
        console.log(token)

        const decodeToken = jwt.verify(token,process.env.SKEY);
        console.log(decodeToken)

        // attach token to request for fututr use
        // console.log(decodeToken.id)

        req.userData = {userId:decodeToken.id}
        next();
    }catch (error){

        return res.status(401).json({message:"Authentication failed",errDesc:error.message});
    }
}

module.exports = auth;
