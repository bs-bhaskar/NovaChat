const jwt = require('jsonwebtoken');
const response=require('../utils/responseHandler')

const authMiddleware= (req, res, next)=>{
    // const authToken= req.cookies?.auth_token;

    // if(!authToken){
    //     return res.status(401).json({
    //         message: 'Authorization token missing. Please provide token'
    //     });
    // }
    const authHeader=req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Authorization token missing. Please provide token'
        });
    }

    const token = authHeader.split(' ')[1]?.trim();

    if (!token) {
        return res.status(401).json({
            message: 'Authorization token missing. Please provide token'
        });
    }

    try {
        const decode= jwt.verify(token, process.env.JWT_SECRET);
        req.user= decode;
        next();
    } catch (error) {
        console.error(error)
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
};

module.exports=authMiddleware