import axios from 'axios';
import dbClient from '../utils/db';

class AppController {

    static async getStat(req, res) {
        const nbUsers = await dbClient.nbUsers();
        return res.json({ nbUsers });
    }
    static home(req, res) {
        return res.json({ 
          Message: 'Welcome To Brisk API',
          Docs: '/api-docs'
        });
    }

    static hello(req, res) {
        res.send('Hello Word');
    }

    static about(req, res) {
        return res.json({ About: 'This is being built by AL and Yam for better access to bitcoin'});
    }

    static bitcoinprice(req, res) {
        const options = {
          method: 'GET',
          url: 'https://api.bitnob.co/api/v1/wallets/payout/rate/USD',
          headers: {accept: 'application/json'},
          Authorization: 'Bearer xxxxx'
        };
        axios
        .request(options)
        .then(function (response) {
          console.log('Hello Bitcoiners hihihi');
          res.sendStatus(200).send(response.data);
        })
        .catch(function (err) {
          console.log('Some error', err);
        });
    }

    static async getWebhooks(req, res) {
      const data = req.body;
      console.log('webhooks...');
      // console.log(data);
      if (data.type === 'InvoiceCreated') {
        console.log(`Invoice ${data.invoiceId} has been created`);
      }
      if (data.type === 'InvoiceProcessing') {
        console.log(`Invoice ${data.invoiceId} processing`);
        const result = await dbClient.updateInvoice({ id: data.invoiceId }, { status: 'processing' });
        console.log(result.matchedCount);
      }
      if (data.type === 'InvoiceInvalid') {
        console.log(`Invoice ${data.invoiceId} is invalid`);
        const result = await dbClient.updateInvoice({ id: data.invoiceId }, { status: 'invalid' });
        console.log(result.matchedCount);
      }
      if (data.type === 'InvoiceSettled') {
        console.log(`Invoice ${data.invoiceId} has been settled`)
        const result = await dbClient.updateInvoice({ id: data.invoiceId }, { status: 'settled' });
        // const update = await dbClient.updateUser({})
        console.log(result.matchedCount);
        // console.log(req.session.userId);
      }
      if (data.type === 'InvoiceExpired') {
        console.log(`Invoice ${data.invoiceId} has expired`)
        const result = await dbClient.updateInvoice({ id: data.invoiceId }, { status: 'expired' });
        console.log(result.matchedCount);
      }
      res.sendStatus(200);
    }
}

export default AppController;