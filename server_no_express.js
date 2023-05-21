
const http = require('http')
const fs = require('fs')
const fsPromise = require('fs').promises
const path = require('path')
const {v4: uuid} = require('uuid')

const PORT = process.env.PORT || 3500;

const server = http.createServer((req,res)=>{
    console.log(req.url, req.method)
    let fileLocale;
    let fileExtentsion;
    let contentType;
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
    // switch(req.url){
    //     case'/':
    //         res.statusCode=200;
    //         fileLocale=path.join(__dirname,'Web_pages', 'index.html');
    //         fs.readFile(fileLocale, 'utf-8', (err,data)=>{
    //             res.end(data)
    //         })
    //     break;
    //     default:
    //         // Give 404 Page
    //         res.statusCode=404;
    //         fileLocale=path.join(__dirname,'Web_pages', '404.html');
    //         fs.readFile(fileLocale, 'utf-8', (err,data)=>{
    //             res.end(data)
    //         })
    //         break;
    // }

    // Best Way
    switch(fileExtentsion){
        case '.css':
            contentType="text/css";
            break;
        case '.js':
            contentType="text/javascript";
            break;
        case '.json':
            contentType="application/json";
            break;
        case '.jpg':
            contentType="image/jpg";
            break;
        case '.png':
            contentType="text/png";
            break;
        case '.txt':
            contentType="text/plain";
            break;
        default:
            contentType="text/html";
    }

    // if req.url is / or ends with / give the index page
    // else if the contentType is text/html give the requested page
    // if the contentType is not text/html give the requested resource, wether it be image or json.
    fileLocale = contentType === 'text/html' && req.url === '/' 
    ? path.join(__dirname,'Web_pages','index.html')
    : contentType === 'text/html' && req.url.slice(-1) === '/'
    ? path.join(__dirname,'Web_pages','index.html')
    : contentType === 'text/html' 
    ? path.join(__dirname,'Web_pages',req.url)
    : path.join(__dirname, req.url)

    // if the user forgets to put the extention behind the url, default to .html
    // if(!fileExtentsion && req.url.slice(-1) !== '/') fileLocale +='.html'

    const fileExists = fs.existsSync(fileLocale);

    const servreFile = async (filePath, contentType, res)=>{
        try {
            const data = await fsPromise.readFile(filePath, 'utf-8');
            res.writeHead(200, {'Content-Type': contentType})
            res.end(data);
        } catch (error) {
            console.error(error);
            res.statusCode =500;
            res.end();
        }
    }
    if(fileExists){
        // serve the file
        console.log('Serving file')
        servreFile(fileLocale,contentType,res)
    }
    else{
        //404
        //redirect (301)
        console.log('Redirecting File')
        let parsedPath = path.parse(fileLocale)
        console.log(parsedPath);
        // .base Because thats where the file is located on the parsedPath object.
        switch(parsedPath.base){
            // Redirect
            case 'testPage.html':
                res.writeHead(301, {'Location':'/new_page.html'})
                res.end();
                break;
            default:
                // 404
                servreFile(path.join(__dirname, 'Web_pages','404.html'), 'text/html',res)
        }
    }
});



server.listen(PORT, ()=> console.log('Server Running on Port : ' + PORT))