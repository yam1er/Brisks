import dbClient from '../utils/db';
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = '123456789';

// const authenticateJWT = (req, res, next) => {
//     const token = req.headers.authorization;
//     if (token) {
//         jwt.verify(token, SECRET_KEY, (err, user) => {
//             if (err) {
//                 return res.sendStatus(403);
//             }
//             req.user = user;
//             next();
//         });
//     } else {
//         res.sendStatus(401);
//     }
// }

class AuthController {
    static async getConnected(req, res) {
        const { email, password } = req.body;
        const user = await dbClient.getUser({ email });
       
        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({id: user.id, email: user.email }, SECRET_KEY, { algorithm: 'HS256', expiresIn: '1h'});
            res.json({ token });
        } else {
            res.status(401).send('Unauthorized - Incorect credentials');
        }
    }
}

export default AuthController;