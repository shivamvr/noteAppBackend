
const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    const token = req.headers.authorization
    if (token) {
        jwt.verify(token, 'admin', (err, decoded) => {
            if (decoded) {
                console.log('decoded',decoded)
                req.body.userID = decoded.userID
                req.body.name = decoded.name
                next()
            } else {
                res.send({ "Error": err })
            }
        })
    } else {
        res.send({ "msg": "Please login" })

    }
}

module.exports = {auth}