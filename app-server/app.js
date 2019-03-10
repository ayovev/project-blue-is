`use strict`;

const express = require(`express`);
const path = require(`path`);
const cookieParser = require(`cookie-parser`);
const morgan = require(`morgan`);

const DATABASE_URI = require(`./database`);

const indexRouter = require(`./routes/index`);
const statusRouter = require(`./routes/status`);
const authenticationRouter = require(`./routes/authentication`);
const signupRouter = require(`./routes/signup`);
const userRouter = require(`./routes/user`);
const emailRouter = require(`./routes/email`);
const securityRouter = require(`./routes/security`);

const app = express();

require(`mongodb`).MongoClient.connect(DATABASE_URI, { useNewUrlParser: true, poolSize: 10 }, (error, client) => {
  app.locals.MongoClient = client;
  app.locals.Database = app.locals.MongoClient.db();
  app.locals.UsersCollection = app.locals.Database.collection(`users`);
  app.locals.PricedataCollection = app.locals.Database.collection(`pricedata`);
  app.locals.AnalysisCollection = app.locals.Database.collection(`analysis`);
});

app.use(morgan(`combined`));
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
app.use(`/api/security`, securityRouter);

module.exports = app;
