const Employee = require("../models/Employees")

const getAllEmployee = async (req, res) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': 'No Employees Found' })
    res.json(employees)
}

const addNewEmployee = async (req, res) => {
    console.log(req.body)
    console.log(req.body.firstName)
    console.log(req.body.lastName)
    if (!req?.body?.firstName || !req?.body?.lastName) {
        return res.status(400).json({ 'message': 'First and Last names are required' })
    }
    try {
        console.log(Employee)
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
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'Id is required' })
    }
    const reqId = req.body.id
    const employee = await Employee.findOne({ _id: reqId }).exec()
    if (!employee) {
        return res.status(204).json({ "message": `No such employee with id of ${reqId} found.` })
    }
    if (req.body?.firstName) employee.firstName = req.body.firstName
    if (req.body?.lastName) employee.lastName = req.body.lastName
    const result = await employee.save();
    res.json(result)
}

const deleteEmployees = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'Id is required' })
    }
    const reqId = req.body.id
    const employee = await Employee.findOne({ _id: reqId }).exec()
    if (!employee) {
        return res.status(204).json({ "message": `No such employee with id of ${reqId} found.` })
    }
    const result = await Employee.deleteOne({ _id: reqId })
    res.json(result)
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'Id is required' })
    }
    const reqId = req.params.id
    const employee = await Employee.findOne({ _id: reqId }).exec()
    if (!employee) {
        return res.status(204).json({ "message": `No such employee with id of ${reqId} found.` })
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