const moment = require(`moment`);
const express = require(`express`);
const router = express.Router();

/* GET status page. */
router.get(`/`, function(req, res, next) {
  res.send({
    datetime: moment().utcOffset(-7).format(`YYYY-MM-DD HH:mm:ss`),
    service: `app-server`,
    status: 200
  });
});

module.exports = router;
