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

module.exports = router;
