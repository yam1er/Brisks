import express from 'express';
import router from './routes/index.js';

const app = express();
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`App listening on port ${port}.`);
});

app.use(router);