const jwt = require('jsonwebtoken');
//Authentication middleware to protect routes 

module.exports = function(req, res, next){
    try{
        const token = req.cookies(token, process.env.JWT_SECRET);
        if(!token){
            return res.status(401).json({message: "Not Logged In"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    }catch(err){
        return res.status(401).json({message: "Invalid Token"});
    }
}

