`use strict`;

const express = require(`express`);
const router = express.Router();

router.route(`/`)
  .post(async (request, response, next) => {
    const { UsersCollection } = request.app.locals;

    let user = await UsersCollection.findOne({ email: request.body.email });

    if (user) {
      // TODO @Nate: modify this to use some better more specific verbiage
      response.status(422).send(`User already exists`);
      return;
    }

    user = {
      firstName: request.body.firstName,
      lastName: request.body.lastName,
      birthdate: request.body.birthdate,
      email: request.body.email,
      password: request.body.password,
      investmentStyle: request.body.investmentStyle,
      profilePicture: `https://ui-avatars.com/api/?name=${request.body.firstName}+${request.body.lastName}&background=4286f4&color=000&rounded=true&size=32`,
      role: `user`,
      createdAt: new Date()
    };

    await UsersCollection.insertOne(user);

    // TODO @Nate: modify this to use some better more specific verbiage
    response.status(201).send();
  });

module.exports = router;
