const express = require('express')
const path = require('path')
const cors = require('cors')

const {logEvents,logger} = require('./middleware/logEvents')
const errorHandler= require('./middleware/Error_Handler')

const PORT = process.env.PORT || 3500;
const app = express();

//built in middleware to handle urlencoded Data like form data
//Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended:false}))
// Middleware for json
app.use(express.json())

// Serving Static Files like css, images, etc...
app.use(express.static(path.join(__dirname,'/public')))

//Custom middleware, next is necessary
// app.use((req,res,next)=>{
//     console.log(req.method + "| : |"+req.path)
//     next()
// })

app.use((req,res,next)=>{
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'Req_Logs.log');
    next();
})

app.use(logger)


// CORS allows everything by domain but we can limit it with a whitelist
const corsWhitelist = ['https://www.example.com','http://localhost:3500','http://127.0.0.1:3500']

//Use whitelist
const corsOptions = {
    origin:(origin,callback)=>{
        // if origin is part of the whitelist
        // !origin = undefined since localhost is considered to be undefined, should be removed on prod
        if(corsWhitelist.indexOf(origin) !== -1 || !origin){
            callback(null,true)
        }
        else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}

// Needs to be here, Cross Origin Resource Sharing
app.use(cors(corsOptions))

//These Gets are called Route Handlers
app.get('^/$|/index(.html)?', (req,res)=>{
    res.sendFile(path.join(__dirname,'Web_pages','index.html'));
})

app.get('/new_page(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'Web_pages','new_page.html'))
})

app.get('/old_page(.html)?',(req,res)=>{
    res.redirect(301, '/new_page')
})

// Route Chaining
app.get('/chain(.html)?',(req,res,next)=>{
    console.log('One')
    next()//
},
(req,res)=>{
    res.send("Chained")
}
)

// Typical way of doing chaining
const one = (req,res,next)=>{
    console.log('one')
    next()
}

const two = (req,res,next)=>{
    console.log('two')
    next()
}

const three = (req,res)=>{
    res.send("Chained")
}

app.get('/tchained(.html)?',[one,two,three])

// 404 Error This must be at the bottom or all requests even valid ones will get linked to here
// can use app.use or app.get but we dont do that to be more systematic, app.use is for middleware, app.get is for route handling
app.all('*', (req,res)=>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname,'Web_pages','404.html'))
    }
    else if(res.accepts('json')){
        res.json({error: '404 Not Found'})
    }
    else{
        res.type('txt').send('404 Not Found')
    }
})

// Override default error handling to show
// Needs to be here to not overwrite things 
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`))