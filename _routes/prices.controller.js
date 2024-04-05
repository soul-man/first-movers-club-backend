const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/stars', starsPrice);

module.exports = router;

async function starsPrice(req, res) {
  try {
    if (req.headers.api_key === process.env.FM_API_KEY) {
      const url = 'https://api-osmosis.imperator.co/tokens/v2/STARS';
      const request = await axios.get(url);
      const price = request.data[0].price.toFixed(4);
      res.send(price)
      return
    } else {
      res.send('Invalid API_KEY!');
    }
  } catch (err) {
    console.log('Could not fetch price from Osmosis API (STARS): ' + err);
  }
}
