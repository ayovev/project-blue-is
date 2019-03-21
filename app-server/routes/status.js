`use strict`;

const logger = require(`../logging`);
const express = require(`express`);
const router = express.Router();

router.route(`/`)
  .get(async (request, response, next) => {
    try {
      const { Database } = request.app.locals;

      logger.info(`pinging database for status / healthcheck`);
      const { ok } = await Database.command({ ping: 1 });

      if (!ok) {
        logger.info(`database not ok`);
        response.sendStatus(503);
      }

      logger.info(`database ok`);
      response.sendStatus(200);
    }
    catch (error) {
      next(error);
    }
  });

module.exports = router;
