`use strict`;

const jwt = require(`jsonwebtoken`);
const express = require(`express`);
const router = express.Router();

router.route(`/:symbol`)
// .get(async (request, response, next) => {
//   const symbol = request.params[`symbol`];

//   const { PricedataCollection } = request.app.locals;

//   const historicalData = await PricedataCollection.findOne({ "metadata.symbol": symbol });

//   console.log(Object.keys(historicalData));

//   response.sendStatus(200);
// })

  .get(async (request, response, next) => {
    const token = request.header(`Authorization`) || request.cookies[`pbiToken`];
    await jwt.verify(token, process.env.TOKEN_SECRET);

    const { AnalysisCollection } = request.app.locals;

    const symbol = request.params[`symbol`].toUpperCase();
    const analysisData = await AnalysisCollection.findOne({ symbol });

    response.status(200).send(analysisData);
  });

module.exports = router;
