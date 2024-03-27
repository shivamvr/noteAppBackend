

const mongoose = require('mongoose')


const employeeSchema = mongoose.Schema({
    fname: {type: String, required: true},
    lname: {type: String, required: true},
    email: {type: String, required: true},
    department: String,
    salary: Number,
    userId: String,
    name: String
},{versionKey: false})

const EmployeeModel = mongoose.model('employee',employeeSchema)

module.exports = {EmployeeModel}