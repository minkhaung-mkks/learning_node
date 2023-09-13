const express = require('express')
const router = express.Router()
const path = require('path')
const userController = require('../../controllers/UserController')


router.route('/register')
    .post(userController.registerNewUser)

router.route('/login')
    .get(userController.handleLogin)

module.exports = router