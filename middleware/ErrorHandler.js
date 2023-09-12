const { logEvents } = require('./LogEvents')
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    logEvents(`${err.name}\t${err.message}`, 'Error_logs.log')
    res.status(500).send(err.message);
}

module.exports = errorHandler