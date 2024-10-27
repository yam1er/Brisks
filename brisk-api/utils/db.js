import { MongoClient } from 'mongodb';

class DBClient {
    constructor() {
        const DB_HOST = process.env.HOST || 'localhost';
        const DB_PORT = process.env.PORT || '27017';
        const url = `mongodb://${DB_HOST}:${DB_PORT}`;
        this.client = new MongoClient(url, { useUnifiedTogology: true });
        this.DB_DATABASE = process.env.DB_DATABASE || 'brisk_db';
        this.connexion = false;
        this.connectionToDB();
    }

    async connectionToDB() {
        try {
            await this.client.connect();
            this.connexion = true;
            this.db = this.client.db(this.DB_DATABASE);
            console.log('Connected to db');
        } catch (err) {
            console.log('Connexion failed. Error :', err);
        }
    }

    isAlive() {
        return this.connexion;
    }

    async addUser(email, password) {
        const users = this.db.collection('users');
        const user = await users.insertOne({ email, password });
        return user.ops[0];
    }

    async getUsers() {
        const users = this.db.collection('users');
        const user = await users.findMany();
        return user;
    }

    async nbUsers() {
        const usersCollection = this.db.collection('users');
        const nb = await usersCollection.countDocuments({});
        return nb;
    }

    async getUser(query) {
        const usersCollection = this.db.collection('users');
        const user = await usersCollection.findOne(query);
        return user;
    }
}

const dbClient = new DBClient;
export default dbClient;