import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import userUtils from '../utils/user';
import sha1 from 'sha1';
import { v4 as uuidv4} from 'uuid';

class AuthController {

    static async getConnect(req, res) {
        const Authorization = req.header('Authorization') || '';
        const credentials = Authorization.split(' ')[1];

        if (!credentials) { return res.status(401).send({ error: 'Unthorized' }); };

        const plainCredentials = Buffer.from(credentials, 'base64').toString('utf-8');
        const [ email, password ] = plainCredentials.split(':');

        if (!email || !password) { return res.status(401).send({ error: 'Unauthorized' }); }

        const hashed_password = sha1(password);
        const user = await dbClient.getUser({ email, password: hashed_password });

        if (!user) { return res.status(401).send({ error: 'Unauthorized' }); }

        const token = uuidv4();
        const key = `auth_${token}`;
        const expireTime = 3600;
        await redisClient.set(key, user._id.toString(), expireTime);

        console.log('Login successful');
        res.status(200).json({ token });
    }

    static async getDisconnect(req, res) {
        const userDetails = await userUtils.getUserDetails(req);

        if (!userDetails.userId) { return res.status(401).send({ error: 'Unauthorized' }); }
        await redisClient.del(userDetails.key);

        res.sendStatus(204);
    }
}


export default AuthController;