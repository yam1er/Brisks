import express from 'express';
import AppController from '../controllers/AppController.js';
import UserController from '../controllers/UserController.js';
import AuthController from '../controllers/AuthController.js';
const jwt = require('jsonwebtoken');

const SECRET_KEY = '123456789';

const router = express.Router();

// const authenticateJWT = (req, res, next) => {
//     const token = req.headers.authorization;
//     if (token) {
//         jwt.verify(token, SECRET_KEY, (err, user) => {
//             if (err) {
//                 console.log(err.message);
//                 return res.sendStatus(403);
//             }
//             req.user = user;
//             next();
//         });
//     } else {
//         res.sendStatus(401);
//     }
// }

const authenticateSession = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.sendStatus(401);
    }
}

/**
 * @swagger
 * /:
 *  get:
 *     summary: Brisk API Home
 *     description: Check API is up
 *     tags:
 *       - General
 *     responses:
 *         200:
 *             description: API Up and running
 */
router.get('/', (req, res) => {
    AppController.home(req, res);
})

/**
 * @swagger
 * /stats:
 *  get:
 *     summary: Get API stats
 *     description: This endpoints return the stats of the API
 *     tags:
 *       - General
 *     responses:
 *         200:
 *             description: Correct stats from DB
 */
router.get('/stats', (req, res) => {
    AppController.getStat(req, res);
})

router.get('/hello', authenticateSession, (req, res) => {
    AppController.hello(req, res);
})

router.get('/about', (req, res) => {
    AppController.about(req, res);
});

router.get('/bitcoin', (req, res) => {
    AppController.bitcoinprice(req, res);
})

/**
 * @swagger
 * /users:
 *  get:
 *     summary: Get list of users
 *     description: Provide list of users available on the platform
 *     tags:
 *       - Users
 *     responses:
 *         200:
 *             description: Correct list of userd;
 */
router.get('/users', (req, res) => {
    UserController.getUsers(req, res);
})

/**
 * @swagger
 * /users/:id:
 *  get:
 *     summary: get a user with id
 *     description: Get the details of a user with user id
 *     tags:
 *       - Users
 *     parameters:
 *          - name: id
 *            in: path
 *            required: true
 *            description: user id
 *            schema:
 *              type: string
 *     responses:
 *         200:
 *             description: The user of id id
 */
router.get('/users/:id', (req, res) => {
    UserController.getUser(req, res);
})

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with the provided information.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *                 - email
 *             properties:
 *                 password:
 *                    type: string
 *                 email:
 *                    type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The user ID
 *                 username:
 *                   type: string
 *                   description: The user's username
 *       400:
 *         description: Bad request
 */
router.post('/users', (req, res) => {
    UserController.postNew(req, res);
})

router.post('/login', (req, res) => {
    AuthController.getConnected(req, res);
})

export default router;
