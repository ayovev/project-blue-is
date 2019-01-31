const jwt = require(`jsonwebtoken`);
const express = require(`express`);
const router = express.Router();

router.route(`/`)
  .post(async (request, response, next) => {
    const MongoClient = request.app.locals.MongoClient;

    const database = MongoClient.db(process.env.DATABASE_NAME);

    const collection = database.collection(`users`);

    const results = await collection.find({ email: request.body.email }).toArray();

    const user = results[0];

    if (!user) {
      response.sendStatus(404);
    }
    else if (user.password !== request.body.password) {
      response.sendStatus(401);
    }
    else {
      response.clearCookie(`pbiToken`);
      const token = await jwt.sign({ data: user._id }, process.env.TOKEN_SECRET, { expiresIn: `1h` });

      response.cookie(`pbiToken`, token.toString(), { httpOnly: true });
      response.sendStatus(200);
    }
  });

module.exports = router;
