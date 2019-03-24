`use strict`;

const express = require(`express`);
const router = express.Router();

router.route(`/`)
  .get(async (request, response, next) => {
    try {
      const { Database } = request.app.locals;

      const { ok } = await Database.command({ ping: 1 });

      if (!ok) {
        return response.sendStatus(503);
      }

      return response.sendStatus(200);
    }
    catch (error) {
      return next(error);
    }
  });

module.exports = router;
