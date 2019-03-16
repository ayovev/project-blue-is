`use strict`;

const express = require(`express`);
const router = express.Router();

router.route(`/`)
  .get(async (request, response, next) => {
    try {
      const { Database } = request.app.locals;
      const { ok } = await Database.command({ ping: 1 });

      if (!ok) {
        response.sendStatus(503);
      }

      response.sendStatus(200);
    }
    catch (error) {
      next(error);
    }
  });

module.exports = router;
