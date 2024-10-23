import axios from 'axios';

class AppController {

    static home(req, res) {
        res.send('Hello Brisk...');
    }

    static hello(req, res) {
        res.status(200).send('Hello Word');
    }

    static about(req, res) {
        res.status(200).send('I am about');
    }

    static bitcoinprice(req, res) {
        const options = {
          method: 'GET',
          url: 'https://sandboxapi.bitnob.co/api/v1/wallets/payout/rate/USD',
          headers: {accept: 'application/json'},
          Authorization: 'Bearer API-KEY'
        };
        axios
        .request(options)
        .then(function (response) {
          console.log('Hello Bitcoiners hihihi');
          //res.status(200).send(response.data);
        })
        .catch(function (error) {
          console.error('Some error');
        });
    }
}

export default AppController;