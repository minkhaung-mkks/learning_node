const data = {}
const fs = require('fs');
const filePath = "models/users.json"
const bcrypt = require('bcrypt')
data.users = []
const fetchUsers = () => {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            console.error(err);
        } else {
            data.users = JSON.parse(fileData);
        }
    })
}

const registerNewUser = async (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) return res.status(400).json({ "message": "Username and passwords are required" })
    const dupUsername = data.users.find(person => person.userName === user);
    if (dupUsername) return res.status(409).json({ "message": "Username already exists" })
    try {
        const hashedPwd = await bcrypt.hash(password, 10)
        const newUser = { 'userName': userName, "password": hashedPwd }
        data.users.push(newUser)
        updateData(data.users, res)
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ "message": `${err.message}` })
    }
}

const handleLogin = async (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) return res.status(400).json({ "message": "Username and passwords are required" })

}

const updateJsonFile = async (data, res, status = 201) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data));   //'a+' is append mode
        res.status(status).send("Data updated successfully " + JSON.stringify(data));
    } catch (err) {
        console.error(err);
        res.status(500).send("Error writing to file");
    }
}
const updateData = async (data, res) => {
    await updateJsonFile(data, res)
    updateFetchedData()
}
module.exports = {
    handleLogin,
    registerNewUser
}