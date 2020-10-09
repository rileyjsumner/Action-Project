const express = require('express');
const router = express.Router();
const https = require('https');
const openSecretsKey = '9d59028159f0f23122cb482707c8edb2';
const governmentKey = 'kYHioTis97xkox7VGjYEQw4IpWLsC8nRZigF0Ae4';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/candidate-industry', function(req, res) {
  https.get('https://www.opensecrets.org/api/?method=candIndByInd&cid=N00007360&cycle=2020&ind=K02&output=json&apikey='+openSecretsKey, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      console.log(data);
      res.send(data);
    });

  })
});

router.get('/get-legislators', function(req, res) {
  https.get('https://www.opensecrets.org/api/?method=getLegislators&id=WI&output=json&apikey='+openSecretsKey, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      console.log(data);
      res.send(data);
    });

  })
});

router.get('/government', function(req, res) {
  https.get('https://api.govinfo.gov/collections/BILLS/2018-01-01T00:00:00Z?offset=0&pageSize=25&api_key='+governmentKey, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      let json = JSON.parse(data);
      console.log(json);
      https.get(json.packages[7].packageLink+"?api_key="+governmentKey, (resp) => {
        let package = '';
        resp.on('data', (chunk) => {
          package += chunk;
        });
        resp.on('end', () => {
          res.send(package);
        })
      });
    })
  })
});

module.exports = router;
