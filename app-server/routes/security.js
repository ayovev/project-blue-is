`use strict`;

const jwt = require(`jsonwebtoken`);
const express = require(`express`);
const { winston } = require(`../logging`);
const businessDays = require(`moment-business-days`);

const router = express.Router();

router.route(`/`)
  .get(async (request, response, next) => {
    try {
      const token = request.header(`Authorization`) || request.cookies[`pbiToken`];
      await jwt.verify(token, process.env.TOKEN_SECRET);

      const { AnalysisCollection } = request.app.locals;
      const symbols = await AnalysisCollection.find({}, { projection: { symbol: 1, _id: 0 } }).toArray();

      return response.status(200).send(symbols);
    }
    catch (error) {
      return next(error);
    }
  });

router.route(`/:symbol`)
  .get(async (request, response, next) => {
    try {
      if (!request.header(`X-Demo`)) {
        const token = request.header(`Authorization`) || request.cookies[`pbiToken`];
        await jwt.verify(token, process.env.TOKEN_SECRET);
      }

      const symbol = request.params[`symbol`].toUpperCase();

      winston.info(`getting analysis for symbol ${symbol}`);

      const { AnalysisCollection } = request.app.locals;
      const analysisData = await AnalysisCollection.findOne({ symbol });
      return response.status(200).send(analysisData);
    }
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
      const tickerPriceData = await PricedataCollection.findOne({"metadata.symbol":symbol}, { projection: { data: 1} });
      const IndexPriceData = await PricedataCollection.findOne({"metadata.symbol":"SPY"}, { projection: { data: 1} });
      let dateCheck;
      let tickerShares,indexShares;

      if(process.env.NODE_ENV === `production`){
        dateCheck = new Date();
        while(!businessDays(dateCheck.toLocaleDateString(),'MM/DD/YYYY').isBusinessDay()) {
          dateCheck.setDate( dateCheck.getDate() - 1);
          //console.log("Date Check: " + dateCheck.toLocaleDateString())
        }
        dateCheck.setMonth(dateCheck.getMonth()-6);
        dateCheckConverted = dateConversion (dateCheck);
        tickerShares= 100000/tickerPriceData.data[dateCheckConverted].adjustedClose;
        indexShares= 100000/IndexPriceData.data[dateCheckConverted].adjustedClose;
      }
      else {
        dateCheck = new Date("2019-03-05");
        dateCheck.setMonth(dateCheck.getMonth()-6);
        dateCheckConverted = dateConversion (dateCheck);        
        tickerShares = 100000/tickerPriceData.data[dateCheckConverted].adjustedClose;
        indexShares = 100000/IndexPriceData.data[dateCheckConverted].adjustedClose;

      }

      let historicalData = [];
      const indexDataValues = Object.values(IndexPriceData.data);
    
      const symbolDataKeys = Object.keys(tickerPriceData.data);
      const symbolDataValues = Object.values(tickerPriceData.data);
    
      const portfolioTickerName = "Portfolio"+symbol;

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
  var y = input.getFullYear().toString();
  var m = (input.getMonth() + 1).toString();
  var d = input.getDate().toString();
  (d.length == 1) && (d = '0' + d);
  (m.length == 1) && (m = '0' + m);
  var correctFormat = y + "-" + m + "-" + d;
  return correctFormat;
 }
module.exports = router;
