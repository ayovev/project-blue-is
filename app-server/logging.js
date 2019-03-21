const { createWriteStream } = require(`fs`);
const _morgan = require(`morgan`);
const { createLogger, format, transports } = require(`winston`);
const { printf } = format;

const morgan = {};
morgan.file = _morgan(`combined`, { stream: createWriteStream('morgan.log', { flags: 'a' })});

let level;

if (process.env.NODE_ENV === `production`) {
  level = process.env.LOG_LEVEL || `info`;
}
else {
  level = `debug`;
}

const winston = createLogger({
  level,
  format: printf(({ level, message, stack }) => {
    const timestamp = new Date().toISOString();

    let string = `${timestamp} ${level}: `

    if(stack) {
      string += `${stack}`
    }
    else {
      string += `${message}`;
    }

    return string;
  }),
  transports: [
    new transports.File({ filename: `winston.log` })
  ]
});

if (process.env.NODE_ENV !== `production`) {
  morgan.console = _morgan(`combined`);
  winston.add(new transports.Console());
}

module.exports = {
  morgan,
  winston
};
