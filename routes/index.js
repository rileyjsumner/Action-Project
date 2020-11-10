const express = require('express');
const router = express.Router();
const https = require('https');
const openSecretsKey = '9d59028159f0f23122cb482707c8edb2';
const governmentKey = 'kYHioTis97xkox7VGjYEQw4IpWLsC8nRZigF0Ae4';
const proPublicaKey = 'KW2l6cMbFi577OnsuRi1KyAazNdo2at0n0CwKUVa';
const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
const openSecretsUrl = 'https://www.opensecrets.org/api/?output=json&apikey='+openSecretsKey;
const proPublicaUrl = 'https://api.propublica.org/congress/v1';

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { title: 'Welcome' });
});

router.get('/get-industries/:cid', (req, res) => {
  https.get(openSecretsUrl+'&method=candIndustry&cid='+req.params.cid+'&cycle=2020', (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      let industries = JSON.parse(data).response.industries.industry;
      res.send(industries);
    })
  })
});

router.get('/get-legislators/:state', (req, res) => {
  https.get(openSecretsUrl+'&method=getLegislators&id='+req.params.state, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      res.send(data);
    });

  })
});

router.get('/government', (req, res) => {
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

router.get('/packages/', (req, res) => {
  https.get('https://api.govinfo.gov/packages/CREC-2018-01-04/summary?offset=0&pageSize=25&api_key='+governmentKey, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      let json = JSON.parse(data);
      console.log(json);
      res.send(json);
    })
  })
})

// Get candidate by id
router.get('/sector/:cid', (req, res) => {
  https.get(openSecretsUrl+'&method=candSector&cid='+req.params.cid+'&cycle=2020', (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      let sectors = JSON.parse(data).response.sectors.sector;
      let name = JSON.parse(data).response.sectors['@attributes'].cand_name;
      let sectorData = [{candidate: name}];

      for(let i = 0; i < sectors.length; i++) {
        sectorData.push({
          name: sectors[i]['@attributes'].sector_name,
          id: sectors[i]['@attributes'].sectorid,
          total: parseInt(sectors[i]['@attributes'].total)
        })
      }
      res.send(sectorData);
    })
  })
})

router.get('/members', (req, res) => {
  let options = {
    headers: {'X-API-KEY': proPublicaKey}
  }
  https.get(proPublicaUrl + '/116/senate/members.json', options, (resp) => {
    let data = '';

    resp.on('data', (chunk) => {
      data += chunk;
    });

    resp.on('end', () => {
      res.send(data);
    })
  })
})
module.exports = router;
