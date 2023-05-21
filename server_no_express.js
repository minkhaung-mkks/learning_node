
const http = require('http')
const fs = require('fs')
const path = require('path')
const {v4: uuid} = require('uuid')

const PORT = process.env.PORT || 3500;

const server = http.createServer((req,res)=>{
    console.log(req.url, req.method)
    let fileLocale;
    // Good Way
    // if(req.url === '/' || req.url === 'index.html'){
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'text/html');
    //     fileLocale = path.join(__dirname,'Web_pages','index.html');
    //     fs.readFile(fileLocale, 'utf-8', (err,data)=>{
    //         res.end(data)
    //     })
    // }
    // Another way
    switch(req.url){
        case'/':
            res.statusCode=200;
            fileLocale=path.join(__dirname,'Web_pages', 'index.html');
            fs.readFile(fileLocale, 'utf-8', (err,data)=>{
                res.end(data)
            })
        break;
        default:
            // Give 404 Page
            res.statusCode=404;
            fileLocale=path.join(__dirname,'Web_pages', '404.html');
            fs.readFile(fileLocale, 'utf-8', (err,data)=>{
                res.end(data)
            })
            break;
    }
});



server.listen(PORT, ()=> console.log('Server Running on Port : ' + PORT))