`use strict`;

const jwt = require(`jsonwebtoken`);
const express = require(`express`);
const { ObjectID } = require(`mongodb`);

const router = express.Router();

router.route(`/profilePicture`)
  .get(async (request, response, next) => {
    // still thinking about whether or not to allow authorization via header or just cookie...
    let token = request.header(`Authorization`) || request.cookies[`pbiToken`];
    token = await jwt.verify(token, process.env.TOKEN_SECRET);
    const userID = token.data;

    const { UsersCollection } = request.app.locals;
    const user = await UsersCollection.findOne({ _id: ObjectID(userID) }, { projection: { profilePicture: 1, _id: 0 } });
    const { profilePicture } = user;

    response.send(profilePicture);
  });

router.route(`/`)
  .get(async (request, response, next) => {
    let token = request.header(`Authorization`) || request.cookies[`pbiToken`];
    token = await jwt.verify(token, process.env.TOKEN_SECRET);
    const userID = token.data;

    const { UsersCollection } = request.app.locals;
    const user = await UsersCollection.findOne({ _id: ObjectID(userID) }, { projection: { firstName: 1, lastName: 1, birthdate: 1, email: 1, investmentStyle: 1, profilePicture: 1, createdAt: 1, _id: 0 } });

    response.send(user);
  })
  .put(async (request, response, next) => {
    let token = request.header(`Authorization`) || request.cookies[`pbiToken`];
    token = await jwt.verify(token, process.env.TOKEN_SECRET);

    // we should add validation here to ensure that nothing bad is being pushed to the DB.
    updatedUserData = request.body;
    const userID = token.data;

    const { UsersCollection } = request.app.locals;
    const { result } = await UsersCollection.updateOne({ _id: ObjectID(userID) }, { $set: updatedUserData });

    if (result.ok) {
      response.sendStatus(200);
    }
    else {
      response.sendStatus(400);
    }
  });


module.exports = router;
