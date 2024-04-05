require('dotenv').config();
const Express = require("express");
const BodyParser = require("body-parser");
const cors = require('cors');
const mcache = require('memory-cache');

// Initializing APP
var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
app.use(cors());

// CACHE

app.set('view engine', 'jade');

var cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody) {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000 * 60);
        res.sendResponse(body)
      }
      next()
    }
  }
}

app.get("/", (req, res) => {
  res.send("First Movers API - up and working!");
});

// Routes
let prices = require("./_routes/prices.controller");
app.use('/prices', cache(30), prices);


// Start Server
app.listen(4000, () => {
  console.log('CurioInfo backend - listening on port ' + process.env.PORT + '!')
});

// Export the Express API for Vercel's build process
module.exports = app;
