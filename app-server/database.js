`use strict`;

let DATABASE_URI;

if (process.env.NODE_ENV === `production`) {
  const PREFIX = `mongodb+srv`;
  const USER = process.env.DATABASE_USER;
  const PASSWORD = process.env.DATABASE_PASSWORD;
  const HOST = ``;
  const NAME = `ieen`;
  const PARAMETERS = `retryWrites=true`;

  DATABASE_URI = `${PREFIX}://${USER}:${PASSWORD}@${HOST}/${NAME}?${PARAMETERS}`;
}
else {
  const PREFIX = `mongodb`;
  const HOST = `mongo`;
  const PORT = `27017`;
  const NAME = `ieen`;

  DATABASE_URI = `${PREFIX}://${HOST}:${PORT}/${NAME}`;
}

module.exports = DATABASE_URI;
