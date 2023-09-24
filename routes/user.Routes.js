



const express = require('express')
const { UserModel } = require('../model/user.model')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const userRouter = express.Router()
userRouter.use(cors());

const bcrypt = require('bcrypt')

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Create a new note
 *     security:
 *       - jwt: []  # Use JWT for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               pass:
 *                 type: string
 *     responses:
 *       201:
 *         description: New User register successfully
 *       401:
 *         description: Invalid request
 */

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


/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               pass:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */

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