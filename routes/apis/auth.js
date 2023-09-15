const express = require('express')
const router = express.Router()
const path = require('path')
const authController = require('../../controllers/AuthController')


router.route('/register')
    .post(authController.registerNewUser)

router.route('/login')
    .get(authController.handleLogin)
router.route('/refreshLogin')
    .get(authController.handleRefreshToken)
router.route('/logout')
    .get(authController.handleLogout)

module.exports = router