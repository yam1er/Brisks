import express from 'express';
import router from './routes/index.js';
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.listen(port, () => {
    console.log(`App listening on port ${port}.`);
});