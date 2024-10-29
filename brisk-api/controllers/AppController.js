import axios from 'axios';
import dbClient from '../utils/db';

class AppController {

    static async getStat(req, res) {
        const nbUsers = await dbClient.nbUsers();
        console.log(nbUsers);
        return res.json({ nbUsers });
    }
    static home(req, res) {
        res.send('Hello Brisk...');
    }

    static hello(req, res) {
        res.send('Hello Word');
    }

    static about(req, res) {
        res.send('I am about');
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