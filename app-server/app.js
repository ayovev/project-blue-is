`use strict`;

const express = require(`express`);
const path = require(`path`);
const cookieParser = require(`cookie-parser`);
const logger = require(`morgan`);

const DATABASE_URI = require(`./database`);

const indexRouter = require(`./routes/index`);
const statusRouter = require(`./routes/status`);
const authenticationRouter = require(`./routes/authentication`);
const signupRouter = require(`./routes/signup`);
const userRouter = require(`./routes/user`);
const emailRouter = require(`./routes/email`);

const app = express();

require(`mongodb`).MongoClient.connect(DATABASE_URI, { useNewUrlParser: true, poolSize: 10 }, (error, client) => {
  app.locals.MongoClient = client;
  app.locals.Database = app.locals.MongoClient.db(`ieen`);
  app.locals.UsersCollection = app.locals.Database.collection(`users`);
});

app.use(logger(`combined`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, `../..`, `app-server/build`)));

app.use(`/api`, indexRouter);
app.use(`/api/status`, statusRouter);
app.use(`/api/authentication`, authenticationRouter);
app.use(`/api/signup`, signupRouter);
app.use(`/api/user`, userRouter);
app.use(`/api/email`, emailRouter);

module.exports = app;
