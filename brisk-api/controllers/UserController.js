import dbClient from "../utils/db";
const bcrypt = require('bcryptjs');
import { ObjectId } from 'mongodb';


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
        const saltRounds = 10;
        let hashed_password = 'yo';
        bcrypt.hash(password, saltRounds, async (err, hashed) => {
            if (err) {
                console.log(err);
            } else {
                hashed_password = hashed;
                const newUser = await dbClient.addUser(email, hashed);
                res.status(201).json(newUser);
            }
        })
    }
}


export default UserController;