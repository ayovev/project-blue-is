`use strict`;

module.exports = (error, request, response, next) => {
  const { winston } = request.app.locals;

  winston.error(error);
  response.status(500).send(error);
}
