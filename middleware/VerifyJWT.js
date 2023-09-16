const jwt = require('jsonwebtoken')
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.sendStatus(401); // Unauthorized.
    console.log(authHeader) // Bearer [Token]
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decodedToken) => {
            if (err) return res.sendStatus(403); // Forbidden
            req.UserInfo.userName = decodedToken.userName;
            req.UserInfo.roles = decodedToken.roles;
            next();
        }
    )
}

module.exports = verifyJWT