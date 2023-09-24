



const express = require('express')
const { NoteModel } = require('../model/note.model')
const { auth } = require('../middleware/auth.middleware')
const cors = require('cors')
const noteRouter = express.Router()
noteRouter.use(cors());


// post note


noteRouter.use(auth)

/**
 * @swagger
 * /note/create:
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
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Note created successfully
 *       401:
 *         description: Unauthorized
 */

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

/**
 * @swagger
 * definitions:
 *   note:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       title:
 *         type: string
 *       content:
 *         type: string
 */

/**
 * @swagger
 * /note:
 *   get:
 *     summary: Get all note
 *     security:
 *       - jwt: []  # Use JWT for authentication
 *     responses:
 *       200:
 *         description: List of todos
 */


noteRouter.get('/', async (req, res) => {
    try {
        const notes = await NoteModel.find({ username: req.body.username })
        res.status(200).send(notes)
    } catch (err) {
        res.send({ "Error": err })
    }
})

// patch

/**
 * @swagger
 * /note/update/{id}:
 *   patch:
 *     summary: Update a note by ID
 *     security:
 *       - jwt: []  # Use JWT for authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the note to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Note updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 */

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


/**
 * @swagger
 * /note/delete/{id}:
 *   delete:
 *     summary: Delete a note by ID
 *     security:
 *       - jwt: []  # Use JWT for authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the note to delete
 *     responses:
 *       204:
 *         description: Note deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Note not found
 */

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