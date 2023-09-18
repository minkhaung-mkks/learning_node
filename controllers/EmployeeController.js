const data = {}
const fs = require('fs');
const filePath = "models/employees.json"
const Employee = "../models/Employees"

const getAllEmployee = (req, res) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': 'No Employees Found' })
    res.json(employees)
}

const addNewEmployee = async (req, res) => {
    if (req?.body?.firstName || req?.body?.lastName) {
        return res.status(400).json({ 'message': 'First and Last names are required' })
    }
    try {
        const result = await Employee.create({
            "firstName": req.body.firstName,
            "lastName": req.body.lastName,
        })
        res.status(201).json(result)
    } catch (err) {
        console.error(err)
    }
}

const updateEmployees = async (req, res) => {
    //Update Employee
    if (req?.body?.id) {
        return res.status(400).json({ 'message': 'Id is required' })
    }
    const reqId = parseInt(req.body.id)
    const employee = await Employee.findOne({ _id: reqId }).exec()
    if (!employee) {
        return res.status(204).json({ "message": `No such employee with id of ${id} found.` })
    }
    if (req.body?.firstName) employee.firstName = req.body.firstName
    if (req.body?.lastName) employee.lastName = req.body.lastName
    const result = await employee.save();
    res.json(result)
}

const deleteEmployees = async (req, res) => {
    if (req?.body?.id) {
        return res.status(400).json({ 'message': 'Id is required' })
    }
    const reqId = parseInt(req.body.id)
    const employee = await Employee.findOne({ _id: reqId }).exec()
    if (!employee) {
        return res.status(204).json({ "message": `No such employee with id of ${id} found.` })
    }
    const result = await Employee.deleteOne({ _id: reqId })
}

const getEmployee = (req, res) => {
    if (req?.params?.id) {
        return res.status(400).json({ 'message': 'Id is required' })
    }
    const reqId = parseInt(req.params.id)
    const employee = await Employee.findOne({ _id: reqId }).exec()
    if (!employee) {
        return res.status(204).json({ "message": `No such employee with id of ${id} found.` })
    }
    res.json(employee)
}

module.exports = {
    getAllEmployee,
    getEmployee,
    addNewEmployee,
    updateEmployees,
    deleteEmployees
}