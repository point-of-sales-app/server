const jwt = require('jsonwebtoken');

module.exports = {
    loginAuth: (req, res, next) => {
        let token = req.headers.token;
        if(!token){
            res.status(400).json({
                message: 'Token is empty'
            })
        }
        try {
            var decoded = jwt.verify(token, process.env.SECRETKEY);
            if(decoded){
                req.decoded = decoded;
                next();
            }
          } catch(err) {
            res.status(400).json({
                message: 'Invalid token'
            })
          }
    }
}