const express = require('express')
const router = express.Router()
const path = require('path')
const data = {}
data.employees = require('../../data/employees.json')

router.route('/')
    .get((req, res) => {
        res.json(data.employees)
    })
    .post((req, res) => {
        const newEmployee = req.body.employee
        data.employees.push(newEmployee)
        // Append to JSON file
    })
    .put((req, res) => {
        //Update Employee
        const newEmployees = req.body.employees
        //Update the json file with the new employee list
    })
    .delete((req, res) => {
        res.json({
            "id": req.body.id
        })
    })

router.route('/:id')
    .get((req, res) => {
        const reqId = req.params.id
        const filteredData = data.employees.filter((employee) => (employee.id === reqId))
        res.json(filteredData)
    })