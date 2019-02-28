`use strict`;

const express = require(`express`);
const router = express.Router();

router.route(`/`)
  .get((request, response, next) => {
    response.sendStatus(200);
  });

module.exports = router;
