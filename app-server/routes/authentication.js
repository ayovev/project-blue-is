`use strict`;

const jwt = require(`jsonwebtoken`);
const express = require(`express`);
const router = express.Router();

const _30_MINUTES = 1800000;

router.route(`/login`)
  .post(async (request, response, next) => {
    try {
      const { UsersCollection } = request.app.locals;

      const user = await UsersCollection.findOne({ email: request.body.email });

      if (!user) {
        return response.status(404).send(`User Does Not Exist`);
      }
      else if (user.password !== request.body.password) {
        return response.status(401).send(`Incorrect Credentials`);
      }
      else {
        response.clearCookie(`pbiToken`);
        const token = await jwt.sign({ data: user._id }, process.env.TOKEN_SECRET, { expiresIn: _30_MINUTES });

        response.cookie(`pbiToken`, token.toString(), { httpOnly: true, expires: new Date(Date.now() + _30_MINUTES) });
        return response.sendStatus(200);
      }
    }
    catch (error) {
      next(error);
    }
  });

router.route(`/logout`)
  .get(async (request, response, next) => {
    try {
      response.clearCookie(`pbiToken`);
      return response.sendStatus(200);
    }
    catch (error) {
      next(error);
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
      next(error);
    }
  });

module.exports = router;
