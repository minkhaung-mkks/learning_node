const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req?.roles) return res.sendStatus(401)
        const allowedRolesArray = [...allowedRoles]
        const allowed = req.roles.map(role => allowedRolesArray.includes(role)).find(val => val === true);
        if (!allowed) return res.sendStatus(401)
        next()
    }
}

module.exports = verifyRoles