`use strict`;

const express = require(`express`);
const router = express.Router();

router.route(`/:symbol`)
  // .get(async (request, response, next) => {
  //   const symbol = request.params[`symbol`];

  //   const { PricedataCollection } = request.app.locals;

  //   const historicalData = await PricedataCollection.findOne({ "metadata.symbol": symbol });

  //   console.log(Object.keys(historicalData));

  //   response.sendStatus(200);
  // });

  .get(async (request, response, next) => {
    const symbol = request.params[`symbol`];

    const { AnalysisCollection } = request.app.locals;

    const analysisData = await AnalysisCollection.findOne({ "symbol": symbol });

    response.status(200).send(analysisData);
  });

module.exports = router;
