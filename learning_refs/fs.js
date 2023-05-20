const fs = require('fs');
const path = require('path')

const fsPromise = require('fs').promises;

// Interesting Fact: These Console Logs are random in their order of execution, buffered data something showing up 2nd.

fs.readFile(path.join(__dirname,'fs_files','test.txt'), (err, data)=>{
    if(err) throw err
    //Prints buffered Data <Buffer 48 54 34...>
    console.log(data) 
    //Prints the actual text
    console.log(data.toString())
})


// By Placing the encoding inside the call, we can get the actual data.
fs.readFile(path.join(__dirname,'fs_files','test.txt'), 'utf-8', (err,data)=>{
    if(err) throw err;
    console.log(data)
})


fs.writeFile(path.join(__dirname,'fs_files','reply.txt'),'Hello From World',(err)=>{
    if (err) throw err
    console.log('Write Complete')
})

// Append will create a file if the file doesnt already exists but will not do this for the folder.
fs.appendFile(path.join(__dirname,'fs_files','append.txt'),'Hello From Append',(err)=>{
    if (err) throw err
    console.log('Append Complete')
})

fs.rename(path.join(__dirname,'fs_files','append.txt'),path.join(__dirname,'fs_files','rename.txt'),(err)=>{
    if (err) throw err
    console.log('Rename Complete')
})


// Use fsPromise to avoid callback hell

const fsProTest = async ()=>{
    let data = await fsPromise.readFile(path.join(__dirname,'fs_files','test.txt'),'utf-8');
    await fsPromise.writeFile(path.join(__dirname,'fs_files','promise.txt'),data)
    await fsPromise.appendFile(path.join(__dirname,'fs_files','promise.txt'),`\n\nWorld:.....`)
    await fsPromise.rename(path.join(__dirname,'fs_files','promise.txt'),path.join(__dirname,'fs_files','promiseDone.txt'))
     data = await fsPromise.readFile(path.join(__dirname,'fs_files','promiseDone.txt'),'utf-8');
    console.log(data)
}

fsProTest()

// Runs on all errors that wasnt caught inside a try catch.
process.on('uncaughtException', err=>{
    console.error('There was an uncaught error : ' + err )
    process.exit(1);
})