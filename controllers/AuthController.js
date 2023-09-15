const data = {}
const fs = require('fs');
const fsPromises = fs.promises;
const jwt = require('jsonwebtoken')
require('dotenv').config()
const path = require('path')
const filePath = "models/users.json"
const bcrypt = require('bcrypt')
data.users = []
const fetchUsers = async () => {
    fs.readFile(filePath, (err, fileData) => {
        if (err) {
            console.error(err);
        } else {
            data.users = JSON.parse(fileData);
        }
    })
}
fetchUsers()
const registerNewUser = async (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) return res.status(400).json({ "message": "Username and passwords are required" })
    await fetchUsers()
    const dupUsername = data.users.find(person => person.userName === userName);
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
    await fetchUsers()
    const foundUser = data.users.find(person => person.userName === userName);
    if (!foundUser) return res.status(401).json({ "message": "Username not Found" })
    const pwdMatch = await bcrypt.compare(password, foundUser.password)
    if (pwdMatch) {
        const accessToken = jwt.sign(
            { "userName": foundUser.userName },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m' }
        )
        const refreshToken = jwt.sign(
            { "userName": foundUser.userName },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        const otherUsers = data.users.filter(person => person.userName !== userName);
        const currentUser = { ...foundUser, refreshToken }
        data.users = [...otherUsers, currentUser]
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'models', 'users.json'),
            JSON.stringify(data.users)
        )
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 60 * 60 * 24 * 1000 })
        res.json({ accessToken })
    }
    else {
        res.status(401).json({ "message": "Username or password is wrong." })
    }
}
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401);
    await fetchUsers()
    const refreshToken = cookies.jwt
    const foundUser = data.users.find(person => person.refreshToken === refreshToken);
    if (!foundUser) return res.sendStatus(403);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decodedToken) => {
            if (err || foundUser.userName !== decodedToken.userName) return res.sendStatus(403)
            const accessToken = jwt.sign(
                { "userName": foundUser.userName },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m' }
            )
            res.json({ accessToken })
        }
    )
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
    registerNewUser,
    handleRefreshToken
}