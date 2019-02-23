require(`dotenv`).config({ path: `./.env` });

const PREFIX = `mongodb://`;
const HOST = process.env.DATABASE_HOST;
const PORT = process.env.DATABASE_PORT;
const NAME = process.env.DATABASE_NAME;

module.exports = DATABASE_URI = `${PREFIX}${HOST}:${PORT}/${NAME}`;
