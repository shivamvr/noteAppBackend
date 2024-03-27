



const express = require('express')
const { NoteModel } = require('../model/note.model')
const { auth } = require('../middleware/auth.middleware')
const cors = require('cors')
const noteRouter = express.Router()
noteRouter.use(cors());


// post note

noteRouter.use(auth)

noteRouter.post("/create", async (req, res) => {
    const payload = req.body
    const token = req.headers.authorization
    // console.log(req.body, token)
    try {
        const note = new NoteModel(payload)
        await note.save()
        res.status(200).send({ "msg": "A new note has been added" })
    } catch (err) {
        res.status(400).send({ "Error": err })
    }
})

noteRouter.get('/', async (req, res) => {
    try {
        const notes = await NoteModel.find({ username: req.body.username })
        res.status(200).send(notes)
    } catch (err) {
        res.send({ "Error": err })
    }
})

// patch

noteRouter.patch("/update/:id", async (req, res) => {
    const payload = req.body
    const id = req.params.id
    console.log(id)
    console.log(req.body)
    try {
        const note = await NoteModel.findOne({ _id: id })
        if (note.username == req.body.username) {
            await NoteModel.findByIdAndUpdate(id, payload)
            res.status(200).send({ "msg": "note updated" })
        } else {
            res.status(400).send({ "msg": "You are not authorize" })
        }
    } catch (err) {
        res.status(400).send({ "msg": "note not found" })
    }
})

// delete

noteRouter.delete("/delete/:id", async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        const note = await NoteModel.findOne({ _id: id })
        if (note.username == req.body.username) {
            await NoteModel.findByIdAndDelete(id)
            res.status(200).send({ "msg": "note has been successfully deleted" })
        } else {
            res.status(400).send({ "msg": "You are not authorize" })
        }
    } catch (err) {
        res.status(400).send({ "msg": "note not found" })
    }
})

module.exports = { noteRouter }