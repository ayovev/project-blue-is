`use strict`;

const jwt = require(`jsonwebtoken`);
const express = require(`express`);
const { ObjectID } = require(`mongodb`);
const { winston } = require(`../logging`);

const router = express.Router();

router.route(`/`)
  .get(async (request, response, next) => {
    try {
      let token = request.cookies[`pbiToken`] || request.header(`authorization`);
      token = await jwt.verify(token, process.env.TOKEN_SECRET);
      const userID = token.data;

      const { UsersCollection } = request.app.locals;
      const user = await UsersCollection.findOne({ _id: ObjectID(userID) }, { projection: { firstName: 1, lastName: 1, birthdate: 1, email: 1, investmentStyle: 1, profilePicture: 1, createdAt: 1, _id: 0 } });

      return response.send(user);
    }
    catch (error) {
      return next(error);
    }
  })
  .put(async (request, response, next) => {
    try {
      let token = request.cookies[`pbiToken`] || request.header(`authorization`);
      token = await jwt.verify(token, process.env.TOKEN_SECRET);
      const userID = token.data;

      winston.info(`updating user ${userID}`);

      const { UsersCollection } = request.app.locals;

      const user = await UsersCollection.findOne({ email: request.body.email });

      if (user) {
        return response.status(422).send(`User already exists`);
      }

      // we should add validation here to ensure that nothing bad is being pushed to the DB.
      const updatedUserData = request.body;

      const { result } = await UsersCollection.updateOne({ _id: ObjectID(userID) }, { $set: updatedUserData });

      if (!result.ok) {
        winston.error(`failed to update user ${userID}`);
        return response.sendStatus(400);
      }
      winston.info(`successfully updated user ${userID}`);
      return response.sendStatus(200);
    }
    catch (error) {
      return next(error);
    }
  });

router.route(`/favorites`)
  .get(async (request, response, next) => {
    try {
      let token = request.cookies[`pbiToken`] || request.header(`authorization`);
      token = await jwt.verify(token, process.env.TOKEN_SECRET);
      const userID = token.data;

      const { UsersCollection } = request.app.locals;
      const result = await UsersCollection.findOne({ _id: ObjectID(userID) }, { projection: { favorites: 1, _id: 0 } });

      return response.send(result.favorites);
    }
    catch (error) {
      return next(error);
    }
  })
  .put(async (request, response, next) => {
    try {
      let token = request.cookies[`pbiToken`] || request.header(`authorization`);
      token = await jwt.verify(token, process.env.TOKEN_SECRET);
      const userID = token.data;

      const { UsersCollection } = request.app.locals;
      let { favorites } = await UsersCollection.findOne({ _id: ObjectID(userID) }, { projection: { favorites: 1, _id: 0 } });

      if (Object.entries(favorites).length === 0 && favorites.constructor === Object) {
        favorites = [];
      }

      if (favorites.includes(request.body.symbol)) {
        favorites = favorites.filter((symbol) => symbol !== request.body.symbol);
      }
      else {
        favorites.push(request.body.symbol);
      }

      const { result } = await UsersCollection.updateOne({ _id: ObjectID(userID) }, { $set: { favorites } });

      if (!result.ok) {
        // winston.error(`failed to <operation> ${request.body.symbol} to favorites for user ${userID}`);
        return response.sendStatus(400);
      }
      // winston.info(`successfully <operation> ${request.body.symbol} to favorites for user ${userID}`);
      return response.sendStatus(200);
    }
    catch (error) {
      return next(error);
    }
  });

router.route(`/profilePicture`)
  .get(async (request, response, next) => {
    try {
      let token = request.cookies[`pbiToken`] || request.header(`authorization`);
      token = await jwt.verify(token, process.env.TOKEN_SECRET);
      const userID = token.data;

      const { UsersCollection } = request.app.locals;
      const user = await UsersCollection.findOne({ _id: ObjectID(userID) }, { projection: { profilePicture: 1, _id: 0 } });
      const { profilePicture } = user;

      return response.send(profilePicture);
    }
    catch (error) {
      return next(error);
    }
  });

router.route(`/resetPassword`)
  .put(async (request, response, next) => {
    try {
      const tokenString = request.body.token;
      const { confirmPassword, password } = request.body;
      const { PasswordResetsCollection, UsersCollection } = request.app.locals;

      const document = await PasswordResetsCollection.findOne({ token: tokenString });

      if (!document || document.used === true) {
        return response.status(400).send(`It appears that this password reset token does not exist or has already been used.`);
      }

      const token = await jwt.verify(tokenString, process.env.TOKEN_SECRET);

      const updateUsersCollection  = await UsersCollection.updateOne({ email: token.data.email }, { $set: { confirmPassword, password } });
      const updatePasswordResetsCollection = await PasswordResetsCollection.updateOne({ token: tokenString }, { $set: { used: true }});

      if (!updateUsersCollection.result.ok || !updatePasswordResetsCollection.result.ok) {
        winston.error(`failed to reset password for user ${token.data.userID}`);
        return response.sendStatus(400);
      }
      winston.info(`successfully updated password for user ${token.data.userID}`);
      return response.sendStatus(200);

    }
    catch (error) {
      return next(error);
    }
  });

module.exports = router;
