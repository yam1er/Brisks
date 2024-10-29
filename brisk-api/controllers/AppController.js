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
}

export default AppController;