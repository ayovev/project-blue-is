const { createLogger, format, transports } = require(`winston`);
const { printf } = format;

let level;

if (process.env.NODE_ENV === `production`) {
  level = process.env.LOG_LEVEL || `info`;
}
else {
  level = `debug`;
}

const logger = createLogger({
  level,
  format: format.combine(
    printf(({ level, message, stack }) => {
      return `${new Date().toISOString()} ${level}: ${message}${stack ? `\n${stack}` : ``}`;
    })
  ),
  transports: [
    new transports.File({ filename: `all.log` })
  ]
});

if (process.env.NODE_ENV !== `production`) {
  logger.add(new transports.Console());
}

module.exports = logger;
