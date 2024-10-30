import dbClient from '../utils/db';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const SECRET_KEY = '123456789';

class AuthController {

    constructor() {
        this.authenticateSession = (req, res, next) => {
            if (req.session.userId) {
                next();
            } else {
                res.sendStatus(401);
            }
        }
    }

    static async getConnected(req, res) {
        const { email, password } = req.body;
        const user = await dbClient.getUser({ email });
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.userId = user._id;
            res.send('Logged in');
        } else {
            res.status(401).send('Unauthorized');
        }
    }
}


export default AuthController;