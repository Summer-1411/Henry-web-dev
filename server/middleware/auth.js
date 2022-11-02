const jwt = require('jsonwebtoken')

//Authorization 

const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if(!token){
        return res.status(401).json({ success: false, message: 'Token khong ton tai!' })
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId = decoded.userId
        next()
    }
    catch(e){
        console.log(e);
        return res.status(403).json({ success: false, message: 'Token khong hop le !' })
    }

}

module.exports = verifyToken