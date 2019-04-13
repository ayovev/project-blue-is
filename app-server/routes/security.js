`use strict`;

const jwt = require(`jsonwebtoken`);
const express = require(`express`);
const { winston } = require(`../logging`);

const router = express.Router();

router.route(`/`)
  .get(async (request, response, next) => {
    try {
      const token = request.cookies[`pbiToken`] || request.header(`authorization`);
      await jwt.verify(token, process.env.TOKEN_SECRET);

      const { CompanyInformationCollection } = request.app.locals;
      const symbols = await CompanyInformationCollection.find({}, { projection: { symbol: 1, companyName: 1, _id: 0 }}).toArray();

      return response.status(200).send(symbols);
    }
    catch (error) {
      return next(error);
    }
  });

router.route(`/analysis/:symbol`)
// .get(async (request, response, next) => {
//   const symbol = request.params[`symbol`];

//   const { PricedataCollection } = request.app.locals;

//   const historicalData = await PricedataCollection.findOne({ "metadata.symbol": symbol });

//   console.log(Object.keys(historicalData));

//   response.sendStatus(200);
// })

  .get(async (request, response, next) => {
    try {
      if (!request.header(`X-Demo`)) {
        const token = request.cookies[`pbiToken`] || request.header(`authorization`);
        await jwt.verify(token, process.env.TOKEN_SECRET);
      }

      const symbol = request.params[`symbol`].toUpperCase();

      winston.info(`getting analysis for symbol ${symbol}`);

      const { AnalysisCollection } = request.app.locals;
      const analysisData = await AnalysisCollection.findOne({ symbol }, { projection: {  _id: 0 }});

      return response.status(200).send(analysisData);
    }
    catch (error) {
      return next(error);
    }
  });

router.route(`/companyInformation/:symbol`)
  .get(async (request, response, next) => {
    try {
      const token = request.cookies[`pbiToken`] || request.header(`authorization`);
      await jwt.verify(token, process.env.TOKEN_SECRET);

      const symbol = request.params[`symbol`].toUpperCase();

      winston.info(`getting company information for symbol ${symbol}`);

      const { CompanyInformationCollection } = request.app.locals;
      const companyInformation = await CompanyInformationCollection.findOne({ symbol }, { projection: {  _id: 0 }});

      return response.status(200).send(companyInformation);
    }
    catch (error) {
      return next(error);
    }
  })

module.exports = router;
