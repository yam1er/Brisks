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
        console.log(userId);
        res.json({ yo: 'yo' });
    }
}

export default TransactionController;