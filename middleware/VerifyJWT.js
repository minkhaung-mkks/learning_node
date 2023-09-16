const jwt = require('jsonwebtoken')
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401); // Unauthorized.
    // Bearer [Token]
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decodedToken) => {
            if (err) return res.sendStatus(403); // Forbidden
            console.log(req)
            console.log(req.UserInfo)
            // req.userInfo = {
            //     "userName": decodedToken.UserInfo.userName
            // }
            req.userName = decodedToken.UserInfo.userName;
            req.roles = decodedToken.UserInfo.roles;
            console.log(req)
            next();
        }
    )
}

module.exports = verifyJWT