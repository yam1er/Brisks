import express from 'express';
import UserController from "../controllers/UserController";
import AuthController from "../controllers/AuthController";


const usersRouter = express.Router();
const auth = new AuthController();

/**
 * @swagger
 * /connect:
 *  get:
 *      summary: Authenticate user
 *      description: Use this endpoint to authenticate user with email and password in req body
 *      tags:
 *          - General
 *      responses:
 *          201:
 *              description: User successfully connected
 *          401:
 *              description: User not found
 */
usersRouter.post('/connect', (req, res) => {
    AuthController.getConnect(req, res);
})

/**
 * @swagger
 * /disconnect:
 *  get:
 *      summary: Disconnect the connected user
 *      description: Use this endpoint to disconnect the connected user
 *      tags:
 *          - General
 *      responses:
 *          204:
 *              description: User successfully disconnected
 *          401:
 *              description: User not found
 */
usersRouter.post('/disconnect', (req, res) => {
    AuthController.getDisconnect(req, res);
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
usersRouter.get('/users', (req, res) => {
    UserController.getUsers(req, res);
})

usersRouter.get('/users/me', (req, res) => {
    UserController.getMe(req, res);
})

// /**
//  * @swagger
//  * /users/:id:
//  *  get:
//  *     summary: get a user with id
//  *     description: Get the details of a user with user id
//  *     tags:
//  *       - Users
//  *     parameters:
//  *          - name: id
//  *            in: path
//  *            required: true
//  *            description: user id
//  *            schema:
//  *              type: string
//  *     responses:
//  *         200:
//  *             description: The user of id id
//  *         401:
//  *             description: User not found
//  */
// usersRouter.get('/users/:id', (req, res) => {
//     UserController.getUser(req, res);
// })


/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user with email and password required.
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
usersRouter.post('/users', (req, res) => {
    UserController.postNew(req, res);
})

export default usersRouter;