`use strict`;

let DATABASE_URI;

if (process.env.NODE_ENV === `production`) {
  const PREFIX = `mongodb+srv`;
  const USERNAME = process.env.DATABASE_USERNAME;
  const PASSWORD = process.env.DATABASE_PASSWORD;
  const HOST = process.env.DATABASE_HOST;
  const NAME = process.env.DATABASE_NAME;
  const PARAMETERS = `retryWrites=true`;

  DATABASE_URI = `${PREFIX}://${USERNAME}:${PASSWORD}@${HOST}/${NAME}?${PARAMETERS}`;
}
else {
  const PREFIX = `mongodb`;
  const HOST = `mongo`;
  const PORT = `27017`;
  const NAME = `ieen`;

  DATABASE_URI = `${PREFIX}://${HOST}:${PORT}/${NAME}`;
}

module.exports = DATABASE_URI;
