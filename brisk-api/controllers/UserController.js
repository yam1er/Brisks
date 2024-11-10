import dbClient from "../utils/db";
import userUtils from "../utils/user";
const bcrypt = require('bcryptjs');
import { ObjectId } from 'mongodb';
import sha1 from 'sha1';


class UserController {
    static async getUsers(req, res) {
        const users = await dbClient.getUsers()
        res.json(users);
    }

    static async getUser(req, res) {
        const id = req.params.id;
        const user = await dbClient.getUser({ _id: ObjectId(id) });
        res.json(user);
    }

    static async postNew(req, res) {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).send('Missing email');
        }
        if (!password) {
            return res.status(400).send('Missing password');
        }
        const user = await dbClient.getUser({ email });
        if (user) {
            return res.status(400).send('Already exist');
        }
        
        const hashed_password = sha1(password);
        const newUser = await dbClient.addUser(email, hashed_password);
        return res.status(201).json(newUser);
    }

    static async getMe(req, res) {
        const userDetails = await userUtils.getUserDetails(req);

        const userObj = await dbClient.getUser({ _id: ObjectId(userDetails.userId) });

        if (!userObj) { return res.status(401).send({ error: 'Unauthorized' }); }

        const user = { id: userObj._id, ...userObj };
        delete user._id;
        delete user.password;
        return res.status(200).send(user);
    }
}

export default UserController;