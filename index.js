

const express = require('express')
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const { userRouter } = require('./routes/user.Routes')
const { noteRouter } = require('./routes/note.Routes')

const cors = require('cors')
const { connection } = require('./db')

const app = express()
app.use(cors());
app.use(express.json())
app.get('/', (req, res) => {
    res.status(200).send({ "msg": "this is the homepage" })
})


const option = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'Note App API',
            version: '1.0.0',
            description: 'A simple API for managing Note items.',
        },
        server: [
            { url: "http://localhost:4500/" }
        ]
    },
    securityDefinitions: {
        // Define a security scheme for JWT authentication
        jwt: {
            type: 'apiKey',
            name: 'Authorization',
            in: 'header',
        },
    },
    apis: ['./routes/*.js'], // Specify your API route files here
};



const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', // Specify the OpenAPI version
        info: {
            title: 'Note App',
            version: '1.0.0',
            description: 'API for managing note items',
        },
        securityDefinitions: {
            jwt: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
            },
        },
    },
    apis: ['./routes/*.js'], // Specify the path to your route files
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);



// Serve the Swagger documentation using Swagger UI
app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.use('/user', userRouter)
app.use('/note', noteRouter)



app.listen(4500, async () => {
    try {
        await connection
        console.log('Connected to DB')
        console.log('Server is running at port 4500')
    } catch (err) {
        console.log("Error:", err)
    }
})