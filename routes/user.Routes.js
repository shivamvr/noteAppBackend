



const express = require('express')
const { UserModel } = require('../model/user.model')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const userRouter = express.Router()
userRouter.use(cors());

const bcrypt = require('bcrypt')

// Register

userRouter.post("/register", async (req, res) => {
    const { username, email, pass } = req.body
    try {
        bcrypt.hash(pass, 5, async (err, hash) => {
            const user = new UserModel({ username, email, pass: hash })
            await user.save()
            res.status(200).send({ "msg": "A new user registered" })
        })
    } catch (err) {
        console.log("Error:", err)
    }

})

// Login

userRouter.post("/login", async (req, res) => {
    const { email, pass } = req.body
    // console.log('login post request')
    const user = await UserModel.findOne({ email })
    if (!user) {
        res.status(400).send({ "msg": "user not found" })
        return
    }

    try {
        bcrypt.compare(pass, user.pass, async (err, result) => {
            if (result) {
                const token = jwt.sign({userId: user._id, username: user.username},'admin')
                res.status(200).send({ "msg": "Login successfully", token,username: user.username })
            } else {
                res.status(400).send({ "Error": err })

            }
        })
    } catch (err) {
        console.log("Error:", err)
    }

})

module.exports = { userRouter }