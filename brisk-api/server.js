import express from 'express';
import router from './routes/index.js';
const bodyParser = require('body-parser');
const session = require('express-session');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const app = express();
const port = process.env.PORT || 3000;

const options = {
    definition : {
        openApi : '3.0.0',
        info : {
            title : 'Brisk API Documentation',
            version : '1.0.0',

        },
        servers: [
            {
                url: 'http://localhost:3000'

            }
        ]
    },
    apis : ['./server.js']
}

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: '123456789', resave: false, saveUninitialized: true }));
app.use(router);

app.listen(port, () => {
    console.log(`App listening on port ${port}.`);
});