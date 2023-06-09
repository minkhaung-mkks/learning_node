const fs = require('fs');
const path = require('path')

const fsPromise = require('fs').promises;

// Interesting Fact: These Console Logs are random in their order of execution, buffered data something showing up 2nd, and 
// rename happening before append which will crash the program

// fs.readFile(path.join(__dirname,'fs_files','test.txt'), (err, data)=>{
//     if(err) throw err
//     //Prints buffered Data <Buffer 48 54 34...>
//     console.log(data) 
//     //Prints the actual text
//     console.log(data.toString())
// })


// // By Placing the encoding inside the call, we can get the actual data.
// fs.readFile(path.join(__dirname,'fs_files','test.txt'), 'utf-8', (err,data)=>{
//     if(err) throw err;
//     console.log(data)
// })


// fs.writeFile(path.join(__dirname,'fs_files','reply.txt'),'Hello From World',(err)=>{
//     if (err) throw err
//     console.log('Write Complete')
// })

// // Append will create a file if the file doesnt already exists but will not do this for the folder.
// fs.appendFile(path.join(__dirname,'fs_files','append.txt'),'Hello From Append',(err)=>{
//     if (err) throw err
//     console.log('Append Complete')
// })

// fs.rename(path.join(__dirname,'fs_files','append.txt'),path.join(__dirname,'fs_files','rename.txt'),(err)=>{
//     if (err) throw err
//     console.log('Rename Complete')
// })


// Use fsPromise to avoid callback hell and to make sure all the functions get executed in order.
const fsProTest = async ()=>{
    let data = await fsPromise.readFile(path.join(__dirname,'fs_files','test.txt'),'utf-8');
    await fsPromise.writeFile(path.join(__dirname,'fs_files','promise.txt'),data)
    await fsPromise.appendFile(path.join(__dirname,'fs_files','promise.txt'),`\n\nWorld:.....`)
    await fsPromise.rename(path.join(__dirname,'fs_files','promise.txt'),path.join(__dirname,'fs_files','promiseDone.txt'))
     data = await fsPromise.readFile(path.join(__dirname,'fs_files','promiseDone.txt'),'utf-8');
    
     //Unlink = delete
    //  await fsPromise.unlink(path.join(__dirname,'fs_files','promiseDone.txt'))
    console.log(data)
}

fsProTest()

// Streams are used for bigger files
const rs = fs.createReadStream(path.join(__dirname,'fs_files','promiseDone.txt'), {encoding: 'utf-8'});
const ws = fs.createWriteStream(path.join(__dirname,'fs_files','new_append.txt'))

rs.pipe(ws)

// If folder exists check
if(!fs.existsSync('./fs_files/new')){
    // Create the folder if the folder doesnt exists
    fs.mkdir('./fs_files/new', (err)=>{
        if(err) throw err
        console.log('Folder Created')
    })
}
else{
    // Delete Folder if it exists
    fs.rmdir('./fs_files/new', (err)=>{
        if(err) throw err
        console.log('Folder Deleted')
    })
}

// Runs on all errors that wasnt caught inside a try catch.
process.on('uncaughtException', err=>{
    console.error('There was an uncaught error : ' + err )
    process.exit(1);
})