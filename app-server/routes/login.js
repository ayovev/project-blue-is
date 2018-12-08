const express = require(`express`);
const router = express.Router();

router.route(`/`)
  .post((request, response, next) => {
    response.sendStatus(200);
  });

module.exports = router;
