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
            console.log(rate);
            res.json(rate);
        })
    }

    static async createInvoice(req, res) {
        const btcpayServerUrl = 'https://pay.withbitcoin.org';
        const storeId = '34oobADDerGCzRrS6r7myPMzqVrtKNF96igdAoJs4o6c';
        const apiKey = '8ba803c1005d54c8998e52f59398de07e69bce0a';
        const email = req.session.userEmail;
        const currency = 'SATS';
        const { amount, title, description } = req.body;
        let requestPayId = "";
        let data = "";

        let apiEndpoint = `/api/v1/stores/${storeId}/payment-requests`;

        const headers = {
            'Content-Type': 'application/json',
            Authorization: 'token ' + apiKey
        }
        let payload = { amount, currency, title, email, description }

        try {
            const response = await fetch(btcpayServerUrl + apiEndpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`Error 1: ${response.status} ${response.statusText}`);
            }
            data = await response.json();
            requestPayId = data.id;
        } catch (error) {
            console.error('Error fetching 1:', error);
        }

        apiEndpoint = `/api/v1/stores/${storeId}/payment-requests/${requestPayId}/pay`;
        //payload = { amount, currency, title, email, description };

        try {
            const response = await fetch(btcpayServerUrl + apiEndpoint, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });
            console.log(response);
            if (!response.ok) {
                throw new Error(`Error 2: ${response.status} ${response.statusText}`);
            }
            data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error fetching 2:', error);
        }
        const invoice = dbClient.addInvoice({ userId: req.session.userId, invoice: data });
        res.status(201).send(invoice);
    }
}

export default TransactionController;