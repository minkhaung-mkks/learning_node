const express = require('express')
const path = require('path')

const PORT = process.env.PORT || 3500;
const app = express();

//built in middleware to handle urlencoded Data like form data
//Content-Type: application/x-www-form-urlencoded
app.use(express.urlencoded({extended:false}))
// Middleware for json
app.use(express.json())


// Serving Static Files like css, images, etc...
app.use(express.static(path.join(__dirname,'/public')))

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
app.get('/*', (req,res)=>{
    res.status(404).sendFile(path.join(__dirname,'Web_pages','404.html'))
})

app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`))