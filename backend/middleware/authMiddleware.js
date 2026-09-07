const jwt = require('jsonwebtoken');

const authMiddleware= (req, res, next)=>{
    const authToken= req.cookies?.auth_token;

    if(!authToken){
        return res.status(401).json({
            message: 'Authorization token missing. Please provide token'
        });
    }
    try {
        const decode= jwt.verify(authToken, process.env.JWT_SECRET);
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