const express = require('express')
const router = express.Router()
const path = require('path')
const employeeController = require('../../controllers/EmployeeController')


router.route('/')
    .get(employeeController.getAllEmployee)
    .post(employeeController.addNewEmployee)
    .put(employeeController.updateEmployees)
    .delete(employeeController.deleteEmployees)

router.route('/:id')
    .get(employeeController.getEmployee)

module.exports = router