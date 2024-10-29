import express from 'express';
import router from './routes/index.js';
const bodyParser = require('body-parser');
const session = require('express-session');
import swaggerDocs from './utils/swagger.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: '123456789', resave: false, saveUninitialized: true }));
app.use(router);

app.listen(port, () => {
    swaggerDocs(app, port);
    console.log(`App listening on port ${port}.`);
});