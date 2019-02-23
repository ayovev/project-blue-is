const express = require(`express`);
const path = require(`path`);
const cookieParser = require(`cookie-parser`);
const logger = require(`morgan`);

const DATABASE_URI = require(`./database`);

const indexRouter = require(`./routes/index`);
const statusRouter = require(`./routes/status`);
const loginRouter = require(`./routes/login`);
const signupRouter = require(`./routes/signup`);

const app = express();

require(`mongodb`).MongoClient.connect(DATABASE_URI, { useNewUrlParser: true, poolSize: 10 }, (error, client) => {
  app.locals.MongoClient = client;
});

app.use(logger(`dev`));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, `public`)));

app.use(`/eapi`, indexRouter);
app.use(`/eapi/status`, statusRouter);
app.use(`/eapi/login`, loginRouter);
app.use(`/eapi/signup`, signupRouter);

module.exports = app;
