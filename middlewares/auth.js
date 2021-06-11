const jwt = require('jsonwebtoken');

module.exports = {
    loginAuth: (req, res, next) => {
        let token = req.headers.token;
        if(!token){
            return res.status(400).json({
                msg: 'Credential Required'
            })
        }
        try {
            var decoded = jwt.verify(token, process.env.JWT_SECRET);
            if(decoded){
                req.decoded = decoded;
                next();
            }
          } catch(err) {
            res.status(400).json({
                msg: 'Invalid token'
            })
          }
    },
    isOwner: (req, res, next) => {
        if(req.decoded.role !== 1) {
            res.status(401).json({
                msg: 'Not Authorized'
            })
        } else {
            next();
        }
    },
    isCashier: (req, res, next) => {
        if(req.decoded.role !== 2) {
            res.status(401).json({
                msg: 'Not Authorized'
            })
        } else {
            next();
        }
    },
    isSales: (req, res, next) => {
        if(req.decoded.role !== 3 && req.decoded.role !== 1) {
            res.status(401).json({
                msg: 'Not Authorized'
            })
        } else {
            next();
        }
    }
}