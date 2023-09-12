
// CORS allows everything by domain but we can limit it with a whitelist
const corsWhitelist = ['https://www.example.com', 'http://localhost:3500', 'http://127.0.0.1:3500']

//Use whitelist
const corsOptions = {
    origin: (origin, callback) => {
        // if origin is part of the whitelist
        // !origin = undefined since localhost is considered to be undefined, should be removed on prod
        if (corsWhitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        }
        else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions