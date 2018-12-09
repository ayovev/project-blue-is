const express = require(`express`);
const router = express.Router();

router.route(`/`)
  .post(async (request, response, next) => {
    const MongoClient = request.app.locals.MongoClient;

    const database = MongoClient.db(process.env.DATABASE_NAME);

    const collection = database.collection(`users`);

    const results = await collection.find({ email: request.body.email }).toArray();

    if (results.length !== 0) {
      response.sendStatus(422);
      return;
    }

    const document = {
      email: request.body.email,
      password: request.body.password,
      birthdate: request.body.birthdate,
      investorPreferences: request.body.investorPreferences
    };

    results = await collection.insertOne(document);

    response.sendStatus(201);
  });

module.exports = router;
