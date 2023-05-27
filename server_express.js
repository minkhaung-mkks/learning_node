const express = require('express')
const path = require('path')

const PORT = process.env.PORT || 3500;
const app = express();

app.get('^/$|/index(.html)?', (req,res)=>{
    res.sendFile(path.join(__dirname,'Web_pages','index.html'));
})

app.get('/new_page(.html)?',(req,res)=>{
    res.sendFile(path.join(__dirname,'Web_pages','new_page.html'))
})

app.get('/old_page(.html)?',(req,res)=>{
    res.redirect(301, '/new_page')
})

// 404 Error This must be at the bottom or all requests even valid ones will get linked to here
app.get('/*', (req,res)=>{
    res.status(404).sendFile(path.join(__dirname,'Web_pages','404.html'))
})

app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`))