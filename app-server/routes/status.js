`use strict`;

const express = require(`express`);
const router = express.Router();

router.route(`/`)
  .get(async (request, response, next) => {
    try {
      const { Database, winston } = request.app.locals;

      winston.info(`pinging database for status / healthcheck`);
      const { ok } = await Database.command({ ping: 1 });

      if (!ok) {
        winston.info(`database not ok`);
        response.sendStatus(503);
      }

      winston.info(`database ok`);
      response.sendStatus(200);
    }
    catch (error) {
      next(error);
    }
  });

module.exports = router;
