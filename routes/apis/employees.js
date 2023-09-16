const express = require('express')
const router = express.Router()
const path = require('path')
const ROLES_LIST = require('../../configs/roles')
const employeeController = require('../../controllers/EmployeeController')
const verifyRoles = require('../../middleware/verifyRoles')

// const verifyJWT = require('../../middleware/VerifyJWT')

router.route('/')
    .get(employeeController.getAllEmployee)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Edtior), employeeController.addNewEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Edtior), employeeController.updateEmployees)
    .delete(verifyRoles(ROLES_LIST.Admin), employeeController.deleteEmployees)
// IF you want to gate keep only a few routes
//  .get(verifyJWT,employeeController.getAllEmployee)

router.route('/:id')
    .get(employeeController.getEmployee)

module.exports = router