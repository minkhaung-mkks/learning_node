const express = require('express');
const router = express.Router();
const path = require('path');

//These Gets are called Route Handlers
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
})

router.get('/new_page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'new_page.html'))
})
router.get('/login(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'))
})
router.get('/old_page(.html)?', (req, res) => {
    res.redirect(301, '/new_page')
})

// Route Chaining
router.get('/chain(.html)?', (req, res, next) => {
    console.log('One')
    next()//
},
    (req, res) => {
        res.send("Chained")
    }
)

// Typical way of doing chaining
const one = (req, res, next) => {
    console.log('one')
    next()
}

const two = (req, res, next) => {
    console.log('two')
    next()
}

const three = (req, res) => {
    res.send("Chained")
}

router.get('/tchained(.html)?', [one, two, three])

module.exports = router;