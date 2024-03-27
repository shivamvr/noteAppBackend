



const express = require('express')
const { EmployeeModel } = require('../model/employee.model')
const { auth } = require('../middleware/auth.middleware')
const cors = require('cors')
const employeeRouter = express.Router()
employeeRouter.use(cors());


// employee post

employeeRouter.use(auth)

employeeRouter.post("/add", async (req, res) => {
    const payload = req.body
    const token = req.headers.authorization
    // console.log(req.body, token)
    try {
        const employee = new EmployeeModel(payload)
        await employee.save()
        res.status(200).send({ "msg": "A new employee has been added" })
    } catch (err) {
        res.status(400).send({ "Error": err })
    }
})

// Get Employees

// employeeRouter.get('/', async (req, res) => {
//     try {
        // const employee = await EmployeeModel.find({ name: req.body.name })
//         res.status(200).send(employee)
//     } catch (err) {
//         res.send({ "Error": err })
//     }
// })


// Pagination and filtering route

employeeRouter.get('/', async (req, res) => {    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const department = req.query.department; // Get department from query parameter
    const query = department ? { department: department } : {}; // Construct query based on department parameter
    
    try {
        const allEmployee = await EmployeeModel.find({ name: req.body.name })
        const employees = await EmployeeModel.find(query)
            .limit(limit)
            .skip((page - 1) * limit)
            .exec();

        res.json({
            data: employees,
            page: page,
            totalPage: Math.ceil(allEmployee.length/limit),
            limit: limit
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// patch

employeeRouter.patch("/:id", async (req, res) => {
    const payload = req.body
    const id = req.params.id
    console.log(id)
    console.log(req.body)
    try {
        const employee = await EmployeeModel.findOne({ _id: id })
        if (employee.name == req.body.name) {
            await EmployeeModel.findByIdAndUpdate(id, payload)
            res.status(200).send({ "msg": "employee updated" })
        } else {
            res.status(400).send({ "msg": "You are not authorize" })
        }
    } catch (err) {
        res.status(400).send({ "msg": "employee not found" })
    }
})

// delete

employeeRouter.delete("/:id", async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        const employee = await EmployeeModel.findOne({ _id: id })
        if (employee.name == req.body.name) {
            await EmployeeModel.findByIdAndDelete(id)
            res.status(200).send({ "msg": "employee has been successfully deleted" })
        } else {
            res.status(400).send({ "msg": "You are not authorize" })
        }
    } catch (err) {
        res.status(400).send({ "msg": "employee not found" })
    }
})


// Searching (Get)

employeeRouter.get('/search', async (req, res) => {
    const query = req.query.q; // Assuming search query is passed as a query parameter
    try {
        const results = await EmployeeModel.find({
            $or: [
                { fname: { $regex: query, $options: 'i' } }, // Case-insensitive search on title
                { lname: { $regex: query, $options: 'i' } } // Case-insensitive search on author
            ]
        });
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = { employeeRouter }