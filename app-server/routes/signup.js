const express = require(`express`);
const router = express.Router();

router.route(`/`)
  .post(async (request, response, next) => {
    const { UsersCollection } = request.app.locals;

    const user = await UsersCollection.findOne({ email: request.body.email });

    if (user) {
      response.sendStatus(422);
      return;
    }

    // const options = {
    //   uri: `https://ui-avatars.com/api/`,
    //   qs: {
    //     name: `John+Doe`,
    //     size: 32
    //   },
    //   resolveWithFullResponse: true
    // };

    // const result = await rp(options);

    // console.log(result);

    const document = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      birthdate: request.body.birthdate,
      email: request.body.email,
      password: request.body.password,
      investmentStyle: request.body.investmentStyle,
      createdAt: new Date(),
      role: `user`
    };

    await UsersCollection.insertOne(document);

    response.sendStatus(201);
  });

module.exports = router;
