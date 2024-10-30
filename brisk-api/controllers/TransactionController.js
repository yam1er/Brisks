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

    static async createInvoice(req, res) {
        const btcpayServerUrl = 'https://pay.withbitcoin.org'
        const storeId = '34oobADDerGCzRrS6r7myPMzqVrtKNF96igdAoJs4o6c'
        const apiKey = '8ba803c1005d54c8998e52f59398de07e69bce0a'
        const amount = 10
        const currency = 'SATS'
        const title = 'Yoyo'
        const email = 'al@gmail.com'
        let requestPayId = "";

        const apiEndpoint1 = `/api/v1/stores/${storeId}/payment-requests`;
        const apiEndpoint2 = `/api/v1/stores/${storeId}/payment-requests/${requestPayId}/pay`;
        const apiEndpoint3 = `/api/v1/stores/${storeId}/rates/BTC_XOF`;

        const headers = {
            'Content-Type': 'application/json',
            Authorization: 'token ' + apiKey
        }
        const payload = {
            amount: amount,
            currency: currency,
            title,
            email
        }
        
        fetch(btcpayServerUrl + apiEndpoint3, {
            method: 'GET',
            headers: headers,
            // body: JSON.stringify(payload)
        })
        .then(response => response)
        .then(data => {
            console.log(data);
            // requestPayId = data.id;
            // console.log(requestPayId);
            res.json({ title });
        })

        // fetch(btcpayServerUrl + apiEndpoint2, {
        //     method: 'POST',
        //     headers: headers,
        //     body: JSON.stringify(payload)
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log(data);
        //     // requestPayId = data.id;
        //     // console.log(requestPayId);
        //     res.json({ title });
        // })
    }
}

export default TransactionController;