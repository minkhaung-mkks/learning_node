const data = {}
data.employees = require('../models/employees.json')
const getAllEmployee = (req, res) => {
    res.json(data.employees)
}

const addNewEmployee = (req, res) => {
    const newEmployee = req.body.employee
    data.employees.push(newEmployee)
    // Append to JSON file
}

const updateEmployees = (req, res) => {
    //Update Employee
    const newEmployees = req.body.employees
    //Update the json file with the new employee list
}

const deleteEmployees = (req, res) => {
    res.json({
        "id": req.body.id
    })
}

const getEmployee = (req, res) => {
    const reqId = parseInt(req.params.id)
    console.log(reqId)
    const filteredData = data.employees.filter((employee) => (employee.id === reqId))
    res.json(filteredData)
}

module.exports = {
    getAllEmployee,
    getEmployee,
    addNewEmployee,
    updateEmployees,
    deleteEmployees
}