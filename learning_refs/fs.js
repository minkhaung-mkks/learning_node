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


// Runs on all errors that wasnt caught inside a try catch.
process.on('uncaughtException', err=>{
    console.error('There was an uncaught error : ' + err )
    process.exit(1);
})