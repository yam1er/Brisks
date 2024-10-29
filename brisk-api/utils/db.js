import { MongoClient } from 'mongodb';

class DBClient {
    constructor() {
        const DB_HOST = process.env.HOST || '127.0.0.1';
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
        } catch (err) {
            console.log('Connexion failed. Error :', err);
        }
    }

    isAlive() {
        return this.connexion;
    }

    async addUser(email, password) {
        const usersCollection = this.db.collection('users');
        await usersCollection.insertOne({ email, password });
        const user = await this.getUser({ email });
        return { id: user._id, email: user.email };
    }

    async getUsers() {
        const usersCollection = this.db.collection('users');
        const users = await usersCollection.find({}).toArray();
        return users;
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