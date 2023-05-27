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

app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`))