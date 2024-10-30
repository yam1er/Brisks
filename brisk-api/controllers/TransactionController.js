import dbClient from "../utils/db"
import { ObjectId } from 'mongodb';

class TransactionController {
    static async getTransactions(req, res) {
        const transactions = await dbClient.getTransactions();
        res.json(transactions);
    }

    static async getTransaction(req, res) {
        const trxId = req.params.id;
        const transaction = await dbClient.getTransaction({ _id: ObjectId(trxId) });
        res.json(transaction);
    }

    static async postNew(req, res) {
        const userId = req.session.userId;
        const date = new Date();
        const { satAmount, fiatAmount, invoice } = req.body;
        const trx = { satAmount, fiatAmount, invoice, userId, date };
        const transaction = await dbClient.addTransaction(trx);
        res.status(201).json(transaction);
    }
}

export default TransactionController;