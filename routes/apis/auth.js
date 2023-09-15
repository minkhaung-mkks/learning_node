const express = require('express')
const router = express.Router()
const path = require('path')
const authController = require('../../controllers/AuthController')


router.route('/register')
    .post(authController.registerNewUser)

router.route('/login')
    .get(authController.handleLogin)

module.exports = router