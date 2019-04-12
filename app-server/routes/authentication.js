`use strict`;

const jwt = require(`jsonwebtoken`);
const express = require(`express`);
const { winston } = require(`../logging`);

const router = express.Router();

const _30_MINUTES = `30m`;

router.route(`/login`)
  .post(async (request, response, next) => {
    try {
      const { UsersCollection } = request.app.locals;

      const user = await UsersCollection.findOne({ email: request.body.email });
      winston.info(`user ${user._id} login attempt`);

      if (!user) {
        winston.error(`user ${user._id} does not exist`);
        return response.status(404).send(`User Does Not Exist`);
      }
      else if (user.password !== request.body.password) {
        winston.error(`incorrect credentials entered for user ${user._id}`);
        return response.status(401).send(`Incorrect Credentials`);
      }
      else {
        response.clearCookie(`pbiToken`);
        const token = await jwt.sign({ data: user._id }, process.env.TOKEN_SECRET, { expiresIn: _30_MINUTES });

        response.cookie(`pbiToken`, token.toString(), { httpOnly: true });
        winston.info(`user ${user._id} successfully logged in`);
        return response.sendStatus(200);
      }
    }
    catch (error) {
      return next(error);
    }
  });

router.route(`/logout`)
  .get(async (request, response, next) => {
    try {
      let token = request.cookies[`pbiToken`] || request.header(`authorization`);
      token = await jwt.verify(token, process.env.TOKEN_SECRET, { ignoreExpiration: true });
      const userID = token.data;

      winston.info(`user ${userID} successfully logged out`);

      response.clearCookie(`pbiToken`);
      return response.sendStatus(200);
    }
    catch (error) {
      return next(error);
    }
  });

router.route(`/validate`)
  .get(async (request, response, next) => {
    try {
      const token = request.cookies[`pbiToken`] || request.headers[`authorization`];
      await jwt.verify(token, process.env.TOKEN_SECRET);

      return response.sendStatus(200);
    }
    catch (error) {
      return next(error);
    }
  });

module.exports = router;
