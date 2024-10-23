import express from 'express';
import AppController from '../controllers/AppController.js';

const router = express.Router();

router.get('/', (req, res) => {
    AppController.home(req, res);
})

router.get('/hello', (req, res) => {
    AppController.hello(req, res);
})

router.get('/about', (req, res) => {
    AppController.about(req, res);
});

router.get('/bitcoin', (req, res) => {
    AppController.bitcoinprice(req, res);
})

export default router;
