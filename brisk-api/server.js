import express from 'express';
import router from './routes/index.js';
import transactionsRouter from './routes/transctions.js';
import usersRouter from './routes/users.js';
const bodyParser = require('body-parser');
const session = require('express-session');
import swaggerDocs from './utils/swagger.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ 
    secret: '123456789',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 5
    }
}));
app.use(router);
app.use(transactionsRouter);
app.use(usersRouter);

app.listen(port, () => {
    swaggerDocs(app, port);
    console.log(`App listening on port ${port}.`);
});