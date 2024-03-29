
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/Users')

const registerNewUser = async (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) return res.status(400).json({ "message": "Username and passwords are required" })
    const dupUsername = await User.findOne({ userName: userName }).exec();
    if (dupUsername) return res.status(409).json({ "message": "Username already exists" })
    try {
        const hashedPwd = await bcrypt.hash(password, 10)
        // Method 1:
        // const newUser = {
        //     'userName': userName,
        //     "password": hashedPwd,
        // }
        // const registerUser = new User(newUser)
        // const result = await registerUser.save()
        // Method 2:
        // const newUser = new User()
        // newUser.userName = userName;
        // newUser.password = password;
        // const result = await newUser.save()
        const result = await User.create({
            'userName': userName,
            "password": hashedPwd,
        })
        res.status(201).send(`New user ${userName} registered`);
    }
    catch (err) {
        console.error(err)
        res.status(500).json({ "message": `${err.message}` })
    }
}

const handleLogin = async (req, res) => {
    const { userName, password } = req.body;
    if (!userName || !password) return res.status(400).json({ "message": "Username and passwords are required" })
    const foundUser = await User.findOne({ userName: userName }).exec();
    if (!foundUser) return res.status(401).json({ "message": "Username not Found" })
    const pwdMatch = await bcrypt.compare(password, foundUser.password)
    if (pwdMatch) {
        const roles = Object.values(foundUser.roles)
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "userName": foundUser.userName,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m' }
        )
        const refreshToken = jwt.sign(
            { "userName": foundUser.userName },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save()
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
    const refreshToken = cookies.jwt
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403);
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decodedToken) => {
            if (err || foundUser.userName !== decodedToken.userName) return res.sendStatus(403)
            const roles = Object.values(foundUser.roles)
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "userName": foundUser.userName,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1m' }
            )
            res.json({ accessToken })
        }
    )
}
const handleLogout = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204); // No content
    const refreshToken = cookies.jwt
    // Is refreshToken in DB
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) {
        // Use Secure: True in prod
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' })
        return res.sendStatus(204);
    };
    foundUser.refreshToken = '';
    const result = await foundUser.save()
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None' })
    res.sendStatus(200)
}
module.exports = {
    handleLogin,
    registerNewUser,
    handleRefreshToken,
    handleLogout
}