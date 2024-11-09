import dbClient from "../utils/db"
import { ObjectId } from 'mongodb';
import userUtils from "../utils/user";

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

    static async getInvoices(req, res) {
        const invoices = await dbClient.getInvoices();
        res.json(invoices);
    }

    static async getInvoice(req, res) {
        const invoiceId = req.params.id;
        const invoice = await dbClient.getInvoice({ _id: ObjectId(invoiceId) });
        res.json(invoice);
    }

    static async postNew(req, res) {
        const userId = req.session.userId;
        const date = new Date();
        const { satAmount, fiatAmount, invoice } = req.body;
        const trx = { satAmount, fiatAmount, invoice, userId, date };
        const transaction = await dbClient.addTransaction(trx);
        res.status(201).json(transaction);
    }

    static async rates(req, res) {
        const btcpayServerUrl = 'https://pay.withbitcoin.org';
        const storeId = '34oobADDerGCzRrS6r7myPMzqVrtKNF96igdAoJs4o6c';
        const apiKey = '8ba803c1005d54c8998e52f59398de07e69bce0a';
        const apiEndpoint = `/api/rates?storeId=${storeId}`;
        const headers = {
            'Content-Type': 'application/json',
            Authorization: 'token ' + apiKey
        }

        fetch(btcpayServerUrl + apiEndpoint, {
            method: 'GET',
            headers: headers,
        })
        .then(response => response.json())
        .then(data => {
            const rate = data[0];
            res.json(rate);
        })
    }

    static async createInvoice(req, res) {
        const userDetails = await userUtils.getUserDetails(req);
        const user = await dbClient.getUser({ _id: ObjectId(userDetails.userId) });
        if (!user) { return res.status(401).send({ error: 'Unauthorized' }); }

        const btcpayServerUrl = 'https://pay.withbitcoin.org';
        const storeId = '34oobADDerGCzRrS6r7myPMzqVrtKNF96igdAoJs4o6c';
        const apiKey = '8ba803c1005d54c8998e52f59398de07e69bce0a';
        const apiEndpoint = `/api/v1/stores/${storeId}/invoices`;
        const email = user.email;
        const currency = 'SATS';
        const { amount, title, description } = req.body;
        let data = "";
        const headers = {
            'Content-Type': 'application/json',
            Authorization: 'token ' + apiKey
        }
        let payload = {
            amount,
            currency,
            title,
            email,
            description,
            checkout: {
                checkoutType: 'V2'
            }
        }
        try {
            const response = await fetch(btcpayServerUrl + apiEndpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`Error 2: ${response.status} ${response.statusText}`);
            }
            data = await response.json();
        } catch (error) {
            console.error('Error fetching:', error);
        }
        data.userId = user._id;
        const invoice = await dbClient.addInvoice(data);
        res.status(201).json(invoice);
    }

    static async swap(req, res) {
        const userDetails = await userUtils.getUserDetails(req);
        const user = await dbClient.getUser({ _id: ObjectId(userDetails.userId) });

        if (!user) { return res.status(401).send({ error: 'Unauthorized' }); }

        const { type, fiatAmount, satAmount } = req.body;
        
        if (!type || !fiatAmount || !satAmount) {
            return res.status(400).send({ message: 'type, fiatAmount, satAmount not provided' });
        }
        if (type === 'sattofiat') {
            if (satAmount > user.balanceSat) { return res.status(400).send({ error: 'Unsufiscient BTC balance' }); }
            const update1 = await dbClient.updateUser({ _id: ObjectId(user._id) }, { $inc : { balanceFiat: +fiatAmount } });
            const update2 = await dbClient.updateUser({ _id: ObjectId(user._id) }, { $inc : { balanceSat: -satAmount } });
            if (update1.matchedCount && update2.matchedCount) { return res.status(200).send({ message: 'Update Successful' }); }
            return res.status(400).send({ message: 'Update Failed' });
        } else if ( type === 'fiattosat') {
            if (fiatAmount > user.balanceFiat) { return res.status(400).send({ message: 'Unsufiscient Fiat balance' }); }
            const update1 = await dbClient.updateUser({ _id: ObjectId(user._id) }, { $inc : { balanceFiat: -fiatAmount } });
            const update2 = await dbClient.updateUser({ _id: ObjectId(user._id) }, { $inc : { balanceSat: +satAmount } });
            if (update1.matchedCount && update2.matchedCount) { return res.status(200).send({ message: 'Update Successful' }); }
            return res.status(400).send({ message: 'Update Failed' });
        }
        return res.status(400).send({ error: 'Bad Operation' });
    }
}

export default TransactionController;