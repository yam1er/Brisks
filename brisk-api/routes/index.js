import express from 'express';
import AppController from '../controllers/AppController.js';
import UserController from '../controllers/UserController.js';
import AuthController from '../controllers/AuthController.js';
const jwt = require('jsonwebtoken');

const SECRET_KEY = '123456789';

const router = express.Router();

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, user) => {
            if (err) {
                console.log(err.message);
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401);
    }
}

router.get('/', (req, res) => {
    AppController.home(req, res);
})

router.get('/stats', (req, res) => {
    AppController.getStat(req, res);
})

router.get('/hello', authenticateJWT, (req, res) => {
    AppController.hello(req, res);
})

router.get('/about', (req, res) => {
    AppController.about(req, res);
});

router.get('/bitcoin', (req, res) => {
    AppController.bitcoinprice(req, res);
})

router.get('/users', (req, res) => {
    UserController.getUsers(req, res);
})

router.post('/users', (req, res) => {
    UserController.postNew(req, res);
})

router.post('/login', (req, res) => {
    AuthController.getConnected(req, res);
})

export default router;
