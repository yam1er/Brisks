import dbClient from '../utils/db';

class AuthController {
    static getConnected(req, res) {
        console.log(req.body);
        // console.log(email);
        // const user = dbClient.getUser({ email });
        return res.json({ yo: 'yo' });
    }
}

export default AuthController;