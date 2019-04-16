`use strict`;

const jwt = require(`jsonwebtoken`);
const express = require(`express`);
const { winston } = require(`../logging`);
const businessDays = require(`moment-business-days`);

const router = express.Router();

router.route(`/`)
  .get(async (request, response, next) => {
    try {
      const token = request.cookies[`pbiToken`] || request.header(`authorization`);
      await jwt.verify(token, process.env.TOKEN_SECRET);

      const { CompanyInformationCollection } = request.app.locals;
      const symbols = await CompanyInformationCollection.find({}, { projection: { symbol: 1, companyName: 1, _id: 0 } }).toArray();

      return response.status(200).send(symbols);
    }
    catch (error) {
      return next(error);
    }
  });

router.route(`/analysis/:symbol`)
  .get(async (request, response, next) => {
    try {
      if (!request.header(`X-Demo`)) {
        const token = request.cookies[`pbiToken`] || request.header(`authorization`);
        await jwt.verify(token, process.env.TOKEN_SECRET);
      }

      const symbol = request.params[`symbol`].toUpperCase();

      winston.info(`getting analysis for symbol ${symbol}`);

      const { AnalysisCollection } = request.app.locals;
      const analysisData = await AnalysisCollection.findOne({ symbol }, { projection: { _id: 0 } });
      
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
      const companyInformation = await CompanyInformationCollection.findOne({ symbol }, { projection: { _id: 0 } });

      return response.status(200).send(companyInformation);
    catch (error) {
      return next(error);
    }
    });

router.route(`/:symbol/historical`)
  .get(async (request, response, next) => {
    try {
      const token = request.header(`Authorization`) || request.cookies[`pbiToken`];
      await jwt.verify(token, process.env.TOKEN_SECRET);

      const symbol = request.params[`symbol`].toUpperCase();

      winston.info(`getting historical data for symbol ${symbol}`);

      const { PricedataCollection } = request.app.locals;
      const tickerPriceData = await PricedataCollection.findOne({ "metadata.symbol": symbol }, { projection: { data: 1 } });
      const IndexPriceData = await PricedataCollection.findOne({ "metadata.symbol": `SPY` }, { projection: { data: 1 } });
      let dateCheck;
      let tickerShares; let indexShares;

      if (process.env.NODE_ENV === `production`) {
        dateCheck = new Date();
        while (!businessDays(dateCheck.toLocaleDateString(), `MM/DD/YYYY`).isBusinessDay()) {
          dateCheck.setDate(dateCheck.getDate() - 1);
        }
        dateCheck.setMonth(dateCheck.getMonth()-6);
        dateCheckConverted = dateConversion(dateCheck);
        tickerShares= 100000/tickerPriceData.data[dateCheckConverted].adjustedClose;
        indexShares= 100000/IndexPriceData.data[dateCheckConverted].adjustedClose;
      }
      else {
        dateCheck = new Date(`2019-03-05`);
        dateCheck.setMonth(dateCheck.getMonth()-6);
        dateCheckConverted = dateConversion(dateCheck);
        tickerShares = 100000/tickerPriceData.data[dateCheckConverted].adjustedClose;
        indexShares = 100000/IndexPriceData.data[dateCheckConverted].adjustedClose;
      }

      let historicalData = [];
      const indexDataValues = Object.values(IndexPriceData.data);

      const symbolDataKeys = Object.keys(tickerPriceData.data);
      const symbolDataValues = Object.values(tickerPriceData.data);

      const portfolioTickerName = `Portfolio`+symbol;

      for (let index = 0; ; index += 5) {
        if (new Date(symbolDataKeys[index]) <= dateCheck) {
          historicalData.push({
            date: symbolDataKeys[index],
            SPY: 0,
            [symbol]: 0,
            [portfolioTickerName]: (tickerShares * symbolDataValues[index].adjustedClose).toFixed(0),
            PortfolioSPY: (indexShares * indexDataValues[index].adjustedClose).toFixed(0)
          });
          break;
        }
        else {
          const symbolNewPrice = symbolDataValues[index].adjustedClose;
          const symbolOldPrice = symbolDataValues[index + 1].adjustedClose;

          const indexNewPrice = indexDataValues[index].adjustedClose;
          const indexOldPrice = indexDataValues[index + 1].adjustedClose;
          historicalData.push({
            date: symbolDataKeys[index],
            SPY: (indexNewPrice - indexOldPrice) / indexOldPrice,
            [symbol]: (symbolNewPrice - symbolOldPrice) / symbolOldPrice,
            [portfolioTickerName]: (tickerShares * symbolDataValues[index].adjustedClose).toFixed(0),
            PortfolioSPY: (indexShares * indexDataValues[index].adjustedClose).toFixed(0)
          });
        }
      }
      historicalData = historicalData.reverse();
      return response.status(200).send(historicalData);
    }
    catch (error) {
      return next(error);
    }
  });

function dateConversion(input) {
  const y = input.getFullYear().toString();
  let m = (input.getMonth() + 1).toString();
  let d = input.getDate().toString();
  (d.length == 1) && (d = `0` + d);
  (m.length == 1) && (m = `0` + m);
  const correctFormat = y + `-` + m + `-` + d;
  return correctFormat;
}

module.exports = router;
