const {format} = require('date-fns')
const {v4 : uuid} = require('uuid')

const fs = require('fs')
const fsPromise = require('fs').promises;
const path = require('path')

const logEvents = async (msg) =>{
    const timestamp = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${timestamp}\t${uuid()}\t${msg}\n`;
    console.log(logItem);
    try {
        if(!fs.existsSync(path.join(__dirname,'logs'))){
            await fsPromise.mkdir(path.join(__dirname,'logs'))
        }
        await fsPromise.appendFile(path.join(__dirname,'logs','server_logs.log'),logItem)
    } catch (err) {
        console.error(err)
    }
}

module.exports=logEvents;