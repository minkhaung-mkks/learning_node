const express = require('express')
const router = express.Router()
const path = require('path')
const employeeController = require('../../controllers/EmployeeController')
// const verifyJWT = require('../../middleware/VerifyJWT')

router.route('/')
    .get(employeeController.getAllEmployee)
    .post(employeeController.addNewEmployee)
    .put(employeeController.updateEmployees)
    .delete(employeeController.deleteEmployees)
// IF you want to gate keep only a few routes
//  .get(verifyJWT,employeeController.getAllEmployee)

router.route('/:id')
    .get(employeeController.getEmployee)

module.exports = router