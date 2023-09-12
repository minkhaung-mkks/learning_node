const data = {}
const fs = require('fs');
const filePath = "models/employees.json"
const updateFetchedData = async () => {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            console.error(err);
        } else {
            data.employees = JSON.parse(fileData);
        }
    })
}
updateFetchedData()
const getAllEmployee = (req, res) => {
    res.json(data.employees)
}

const addNewEmployee = (req, res) => {
    const newEmployee = {
        "id": data.employees.length + 1,
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
    }
    data.employees.push(newEmployee)
    // Append to JSON file
    updateData(data.employees, res)
}

const updateEmployees = (req, res) => {
    //Update Employee
    const reqId = parseInt(req.body.id)
    const employee = data.employees.filter((emp) => (emp.id === reqId))
    console.log("DETED")
    console.log(employee)
    if (!employee) {
        return res.status(400).json({ "message": `No such employee with id of ${id} found.` })
    }
    if (req.body.firstName) employee.firstName = req.body.firstName
    if (req.body.lastName) employee.lastName = req.body.lastName
    const otherEmployees = data.employees.filter(emp => (
        emp.id !== reqId
    ))
    console.log(otherEmployees)
    const newUnsortedArray = [...otherEmployees, ...employee]
    console.log(newUnsortedArray)
    const sortedArray = newUnsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0)
    // console.log(sortedArray)
    //Update the json file with the new employee list
    updateData(sortedArray, res)
}

const deleteEmployees = (req, res) => {
    const reqId = parseInt(req.body.id)
    const otherEmployees = data.employees.filter(emp => (
        emp.id !== reqId
    ))
    updateData(otherEmployees, res)
}

const getEmployee = (req, res) => {
    const reqId = parseInt(req.params.id)
    console.log(reqId)
    const filteredData = data.employees.filter((employee) => (employee.id === reqId))
    res.json(filteredData)
}

const updateJsonFile = async (data, res) => {
    fs.writeFile(filePath, JSON.stringify(data), (err) => {
        if (err) {
            res.send("Error writing to file");
        } else {
            res.send("Data updated successfully " + JSON.stringify(data));
        }
    });
}

const updateData = async (data, res) => {
    updateJsonFile(data, res)
    updateFetchedData()
}

module.exports = {
    getAllEmployee,
    getEmployee,
    addNewEmployee,
    updateEmployees,
    deleteEmployees
}