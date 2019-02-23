const moment = require(`moment`);
const express = require(`express`);
const router = express.Router();

router.route(`/`)
  .get((request, response, next) => {
    response.send({
      datetime: moment().utcOffset(-7).format(`YYYY-MM-DD HH:mm:ss`),
      service: `app-server`,
      status: 200
    });
  });

module.exports = router;
