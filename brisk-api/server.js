import express from 'express';
import cors from 'cors';
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
const corsOption = {
    origin: ['http://localhost:3000', 'http://173.230.128.72'],
    credentials: true,
    optionsSuccessStatus: 200
}
app.use(cors(corsOption));
app.use(session({ 
    secret: '123456789',
    resave: true,
    saveUninitialized: false,
    cookie: {
        sameSite: 'None',
        secure: false,
        maxAge: 1000 * 60 * 60
    }
}));
app.use(router);
app.use(transactionsRouter);
app.use(usersRouter);

app.listen(port, () => {
    swaggerDocs(app, port);
    console.log(`App listening on port ${port}.`);
});