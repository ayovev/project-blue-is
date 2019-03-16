`use strict`;

const jwt = require(`jsonwebtoken`);
const express = require(`express`);
const { ObjectID } = require(`mongodb`);

const router = express.Router();

router.route(`/profilePicture`)
  .get(async (request, response, next) => {
    try {
      let token = request.header(`Authorization`) || request.cookies[`pbiToken`];
      token = await jwt.verify(token, process.env.TOKEN_SECRET);
      const userID = token.data;

      const { UsersCollection } = request.app.locals;
      const user = await UsersCollection.findOne({ _id: ObjectID(userID) }, { projection: { profilePicture: 1, _id: 0 } });
      const { profilePicture } = user;

      response.send(profilePicture);
    }
    catch (error) {
      next(error);
    }
  });

router.route(`/`)
  .get(async (request, response, next) => {
    try {
      let token = request.header(`Authorization`) || request.cookies[`pbiToken`];
      token = await jwt.verify(token, process.env.TOKEN_SECRET);
      const userID = token.data;

      const { UsersCollection } = request.app.locals;
      const user = await UsersCollection.findOne({ _id: ObjectID(userID) }, { projection: { firstName: 1, lastName: 1, birthdate: 1, email: 1, investmentStyle: 1, profilePicture: 1, createdAt: 1, _id: 0 } });

      response.send(user);
    }
    catch (error) {
      next(error);
    }
  })
  .put(async (request, response, next) => {
    try {
      let token = request.header(`Authorization`) || request.cookies[`pbiToken`];
      token = await jwt.verify(token, process.env.TOKEN_SECRET);
      const userID = token.data;

      const { UsersCollection } = request.app.locals;

      const user = await UsersCollection.findOne({ email: request.body.email });

      if (user) {
        response.status(422).send(`User already exists`);
        return;
      }

      // we should add validation here to ensure that nothing bad is being pushed to the DB.
      const updatedUserData = request.body;

      const { result } = await UsersCollection.updateOne({ _id: ObjectID(userID) }, { $set: updatedUserData });

      if (result.ok) {
        response.sendStatus(200);
      }
      else {
        response.sendStatus(400);
      }
    }
    catch (error) {
      next(error);
    }
  });


module.exports = router;
