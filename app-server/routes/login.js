`use strict`;

const jwt = require(`jsonwebtoken`);
const express = require(`express`);
const router = express.Router();

router.route(`/`)
  .post(async (request, response, next) => {
    const { UsersCollection } = request.app.locals;

    const user = await UsersCollection.findOne({ email: request.body.email });

    if (!user) {
      response.sendStatus(404);
    }
    else if (user.password !== request.body.password) {
      response.sendStatus(401);
    }
    else {
      response.clearCookie(`pbiToken`);
      const token = await jwt.sign({ data: user._id }, process.env.TOKEN_SECRET, { expiresIn: `30m` });

      response.cookie(`pbiToken`, token.toString(), { httpOnly: true });
      response.sendStatus(200);
    }
  });

module.exports = router;
