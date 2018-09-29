var moment = require(`moment`);
var express = require(`express`);
var router = express.Router();

/* GET status page. */
router.get(`/`, function(req, res, next) {
  res.send({
    datetime: moment().format(`YYYY-MM-DD HH:mm:ss`),
    service: `app-server`,
    status: 200
  });
});

module.exports = router;
