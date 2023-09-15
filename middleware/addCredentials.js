const corsWhitelist = require("../configs/allowedOrigins");

const addCredentialsHeader = (req, res, next) => {
    const origin = req.header.origin
    if (corsWhitelist.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true)
    }
    next()
}

module.exports = addCredentialsHeader