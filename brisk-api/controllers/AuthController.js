import dbClient from '../utils/db';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = '123456789';

class AuthController {
    static async getConnected(req, res) {
        const { email, password } = req.body;
        console.log(email);
        const user = await dbClient.getUser({ email });
        console.log(user);
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h'});
            res.json({ token });
        } else {
            res.status(401).send('Incorrect credentials');
        }
    }
}

export default AuthController;