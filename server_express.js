const express = require('express')
const path = require('path')
const cors = require('cors')

const { logEvents, logger } = require('./middleware/LogEvents')
const errorHandler = require('./middleware/ErrorHandler')
const corsOptions = require('./configs/CorOptions')

const PORT = process.env.PORT || 3500;
const app = express();

//built in middleware to handle urlencoded Data like form data
//Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))
// Middleware for json
app.use(express.json())

app.use(logger)
// Serving Static Files like css, images, etc...
// '/' is default
app.use(express.static(path.join(__dirname, '/public')))
// make other routes use the public folder for static files
app.use('/subdirs', express.static(path.join(__dirname, '/public')))

// make it use the routes/root.js for / urls
app.use('/', require('./routes/root'))
// make it use the routes/subdir.js for /subdirs urls
app.use('/subdirs', require('./routes/subdir'))
app.use('/employees', require('./routes/apis/employees'))
app.use('/auth', require('./routes/apis/auth'))

//Custom middleware, next is necessary
// app.use((req,res,next)=>{
//     console.log(req.method + "| : |"+req.path)
//     next()
// })

// app.use((req, res, next) => {
//     logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'Req_Logs.log');
//     console.log(`${req.method}\t${req.headers.origin}\t${req.url}`)
//     next();
// })

// Needs to be here, Cross Origin Resource Sharing
app.use(cors(corsOptions))

// Override default error handling to show
// Needs to be here to not overwrite things 
app.use(errorHandler)


// 404 Error This must be at the bottom or all requests even valid ones will get linked to here
// can use app.use or app.get but we dont do that to be more systematic, app.use is for middleware, app.get is for route handling
app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }
    else if (res.accepts('json')) {
        res.json({ error: '404 Not Found' })
    }
    else {
        res.type('txt').send('404 Not Found')
    }
})


app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`))