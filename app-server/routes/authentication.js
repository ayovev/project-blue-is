`use strict`;

const jwt = require(`jsonwebtoken`);
const express = require(`express`);
const router = express.Router();

router.route(`/login`)
  .post(async (request, response, next) => {
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
      const token = await jwt.sign({ data: user._id }, process.env.TOKEN_SECRET, { expiresIn: `30m` });

      response.cookie(`pbiToken`, token.toString(), { httpOnly: true });
      return response.sendStatus(200);
    }
  });

router.route(`/logout`)
  .get(async (request, response, next) => {
    response.clearCookie(`pbiToken`);
    return response.sendStatus(200);
  });

router.route(`/validate`)
  .get(async (request, response, next) => {
    const token = request.cookies[`pbiToken`] || request.headers[`authorization`];

    try {
      await jwt.verify(token, process.env.TOKEN_SECRET);
    }
    catch (error) {
      return response.status(401).send(error);
    }

    return response.sendStatus(200);
  });

module.exports = router;
