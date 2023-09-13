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

const addNewEmployee = async (req, res) => {
    const newEmployee = {
        "id": data.employees[data.employees.length - 1].id + 1 || 1,
        "firstName": req.body.firstName,
        "lastName": req.body.lastName,
    }
    await updateFetchedData()
    data.employees.push(newEmployee)
    // Append to JSON file
    updateData(data.employees, res)
}

const updateEmployees = async (req, res) => {
    //Update Employee
    const reqId = parseInt(req.body.id)
    await updateFetchedData()
    const employee = data.employees.filter((emp) => (emp.id === reqId))
    if (!employee) {
        return res.status(400).json({ "message": `No such employee with id of ${id} found.` })
    }
    console.log(employee)
    if (req.body.firstName) employee[0].firstName = req.body.firstName
    if (req.body.lastName) employee[0].lastName = req.body.lastName
    const otherEmployees = data.employees.filter(emp => (
        emp.id !== reqId
    ))
    console.log(employee)
    const newUnsortedArray = [...otherEmployees, ...employee]
    const sortedArray = newUnsortedArray.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0)
    // console.log(sortedArray)
    //Update the json file with the new employee list
    updateData(sortedArray, res)
}

const deleteEmployees = async (req, res) => {
    const reqId = parseInt(req.body.id)
    await updateFetchedData()
    const otherEmployees = data.employees.filter(emp => (
        emp.id !== reqId
    ))
    updateData(otherEmployees, res)
}

const getEmployee = (req, res) => {
    const reqId = parseInt(req.params.id)
    const filteredData = data.employees.filter((employee) => (employee.id === reqId))
    res.json(filteredData)
}

const updateJsonFile = async (data, res) => {

    try {
        fs.writeFileSync(filePath, JSON.stringify(data));   //'a+' is append mode
        res.send("Data updated successfully " + JSON.stringify(data));
    } catch (err) {
        console.error(err);
        res.send("Error writing to file");
    }
}

const updateData = async (data, res) => {
    await updateJsonFile(data, res)
    updateFetchedData()
}

module.exports = {
    getAllEmployee,
    getEmployee,
    addNewEmployee,
    updateEmployees,
    deleteEmployees
}