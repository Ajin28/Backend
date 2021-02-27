var express = require('express');
const cors = require('./cors');
const authenticate = require('../authenticate')
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.route('/feedback')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .post(cors.corsWithOptions, (req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json')
    res.json(req.body)
  })

module.exports = router;
