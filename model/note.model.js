

const mongoose = require('mongoose')

const noteSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    userId: String,
    username: String
},{versionKey: false})

const NoteModel = mongoose.model('note',noteSchema)

module.exports = {NoteModel}