`use strict`;

const express = require(`express`);
const router = express.Router();

router.route(`/`)
  .get((request, response, next) => {
    return response.send(`Express root`);
  });

module.exports = router;
