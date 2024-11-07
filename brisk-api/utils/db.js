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
        const data = { email, password, storeName: email, balanceSat: 0, balanceFiat: 0 }
        await this.usersCollection.insertOne(data);
        const user = await this.getUser({ email });
        return { id: user._id, email: user.email };
    }

    async getUsers() {
        const users = await this.usersCollection.find({}).toArray();
        users.forEach(element => {
            element.id = element._id;
            delete element._id;
            delete element.password;
        });
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
        return transaction.ops;
    }

    async addInvoice(query) {
        const invoice = await this.invoicesCollection.insertOne(query);
        return invoice.ops[0];
    }

    async getInvoices() {
        const invoices = await this.invoicesCollection.find({}).toArray();
        return invoices;
    }

    async getInvoice(query) {
        const invoice = await this.invoicesCollection.findOne(query);
        return invoice;
    }

    async updateInvoice(conditionQuery, updateQuery) {
        const update = await this.invoicesCollection.updateOne(conditionQuery, updateQuery);
        return update;
    }

    async updateUser(conditionQuery, updateQuery) {
        await this.db.collection('users').updateMany(
            { },
            [
                { $set: { 
                    balanceSat: { $toInt: "$balanceSat" }, 
                    balanceFiat: { $toDouble: "$balanceFiat" } 
                }}
            ]
        );
        const update = await this.usersCollection.updateOne(conditionQuery, updateQuery);
        return update;
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