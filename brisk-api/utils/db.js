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
            this.usersCollection = this.db.collection('users');
            this.transactionsCollection = this.db.collection('transactions');
            this.invoicesCollection = this.db.collection('invoices');
        } catch (err) {
            console.log('Connexion failed. Error :', err);
        }
    }

    isAlive() {
        return this.connexion;
    }

    async addUser(email, password) {
        await this.usersCollection.insertOne({ email, password });
        const user = await this.getUser({ email });
        return { id: user._id, email: user.email };
    }

    async getUsers() {
        const users = await this.usersCollection.find({}).toArray();
        return users;
    }

    async nbUsers() {
        const nb = await this.usersCollection.countDocuments({});
        return nb;
    }

    async getUser(query) {
        const user = await this.usersCollection.findOne(query);
        return user;
    }

    async addTransaction(query) {
        const transaction = await this.transactionsCollection.insertOne(query);
        //const user = await this.getUser({ email });
        return transaction.ops;
    }

    async addInvoice(query) {
        const invoice = await this.invoicesCollection.insertOne(query);
        return invoice.ops;
    }

    async getTransactions() {
        const transactions = await this.transactionsCollection.find({}).toArray();
        return transactions;
    }

    async getTransaction(query) {
        const transaction = await this.transactionsCollection.findOne(query);
        return transaction;
    }
}

const dbClient = new DBClient;
export default dbClient;