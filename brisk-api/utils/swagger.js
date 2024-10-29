const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

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
    apis : ['./routes/index.js']
}

const swaggerSpec = swaggerJSDoc(options);

function swaggerDocs(app, port) {
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    app.get('api-docs', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec)
    })
}

export default swaggerDocs;