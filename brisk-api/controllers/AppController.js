import axios from 'axios';
import dbClient from '../utils/db';
import { ObjectId } from 'mongodb';

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

    static async getWebhooks(req, res) {
      const data = req.body;
      console.log('webhooks...');
      if (data.type === 'InvoiceCreated') {
        console.log(`Invoice ${data.invoiceId} has been created`);
      }
      if (data.type === 'InvoiceProcessing') {
        console.log(`Invoice ${data.invoiceId} processing`);
        const result = await dbClient.updateInvoice({ id: data.invoiceId }, { $set : { status: 'processing' } });
        console.log(result.matchedCount);
      }
      if (data.type === 'InvoiceInvalid') {
        console.log(`Invoice ${data.invoiceId} is invalid`);
        const result = await dbClient.updateInvoice({ id: data.invoiceId }, { $set : { status: 'invalid' } });
        console.log(result.matchedCount);
      }
      if (data.type === 'InvoiceSettled') {
        await dbClient.updateInvoice({ id: data.invoiceId }, { $set : { status: 'settled' } });
        console.log(`Invoice ${data.invoiceId} has been settled`);
        const invoice = await dbClient.getInvoice({ id: data.invoiceId });
        const update = await dbClient.updateUser({ _id: ObjectId(invoice.userId) }, { $inc : { balanceSat: Number(invoice.amount) } });
      }
      if (data.type === 'InvoiceExpired') {
        console.log(`Invoice ${data.invoiceId} has expired`)
        const result = await dbClient.updateInvoice({ id: data.invoiceId }, { $set : { status: 'expired' } });
        console.log(result.matchedCount);
      }
      res.sendStatus(200);
    }
}

export default AppController;