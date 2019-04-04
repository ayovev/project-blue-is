`use strict`;

const { winston } = require(`../logging`);

module.exports = (error, request, response, next) => {
  winston.error(error);
  return response.status(500).send(error);
};
