from flask import Flask, Response, jsonify
import os
from pymongo import MongoClient
import schedule
import time
import functools

from database import DATABASE_URI, getAVData, getIEXData
from calculations import *

app = Flask("analyzer-service")

app.MongoClient = MongoClient(DATABASE_URI)
app.Database = app.MongoClient[os.getenv("DATABASE_NAME", "ieen")]
app.AnalysisCollection = app.Database["analysis"]
app.CompanyInformationCollection = app.Database["companyInformation"]
app.PasswordResetsCollection = app.Database["passwordResets"]
app.PricedataCollection = app.Database["pricedata"]
app.UsersCollection = app.Database["users"]

env = os.getenv("PYTHON_ENV")
app.config["ENV"] = env

if env == "development":
  app.config["DEBUG"] = 1

index = "SPY"

@app.route("/", methods = ["GET"])
def rootHandler():
  # status = getAVData(app.PricedataCollection)
  # status1 = getIEXData(app.CompanyInformationCollection)
  # return str(status) + ' ' +  str(status1)
  return "ok - root"

@app.route("/status", methods = ["GET"])
def statusHandler():
  status = app.Database.command("ping")
  ok = bool(status["ok"])

  if not ok:
    return Response(status = 503)

  return Response(status = 200)

@app.route("/analyze", methods = ["PUT", "GET"])
def analyzeHandler():
  symbols = pd.read_csv('DOW30.csv', header=None)
  symbols = symbols.iloc[:,0].values.tolist()
  symbols.append('SPY')
  symbols.append('MU')

  for symbol in symbols:
    symbolData = loadHistorical(symbol)
    symbolData = filterData(symbolData)
    symbolData = symbolData.iloc[::-1]
    pReturns = getPctReturns(symbolData)

    indexData = loadHistorical(index)
    indexData = filterData(indexData)
    indexData = indexData.iloc[::-1]
    bReturns = getPctReturns(indexData)

    valueAtRisk = calculateValueAtRisk(pReturns)
    beta = calculateBeta(pReturns, bReturns)
    standardDeviation = calculateStandardDeviation(pReturns)
    rSquared = calculateRSquared(pReturns, bReturns)
    expectedReturn = calculateExpectedReturn(indexData, beta)
    sharpeRatio = calculateSharpeRatio(expectedReturn, standardDeviation)
    investabilityIndex = float(0.0)

    returnDict = {}
    returnDict["symbol"] = symbol
    returnDict["valueAtRisk"] = valueAtRisk
    returnDict["beta"] = beta
    returnDict["standardDeviation"] = standardDeviation
    returnDict["rSquared"] = rSquared
    returnDict["expectedReturn"] = expectedReturn
    returnDict["sharpeRatio"] = sharpeRatio
    returnDict["investabilityIndex"] = investabilityIndex

    query = {"symbol" : symbol}
    app.AnalysisCollection.replace_one(query, returnDict, True)

  return "called analyzeHandler()"

@app.route("/analyze/<symbol>", methods = ["GET", "PUT"])
def analyzeSymbolHandler(symbol):
  symbolData = loadHistorical(symbol)
  symbolData = filterData(symbolData)
  symbolData = symbolData.iloc[::-1]
  pReturns = getPctReturns(symbolData)

  indexData = loadHistorical(index)
  indexData = filterData(indexData)
  indexData = indexData.iloc[::-1]
  bReturns = getPctReturns(indexData)

  valueAtRisk = calculateValueAtRisk(pReturns)
  beta = calculateBeta(pReturns, bReturns)
  standardDeviation = calculateStandardDeviation(pReturns)
  rSquared = calculateRSquared(pReturns, bReturns)
  expectedReturn = calculateExpectedReturn(indexData, beta)
  sharpeRatio = calculateSharpeRatio(expectedReturn, standardDeviation)

  return "Calculated all values for {}".format(symbol)

@app.route('/analyze/II', methods = ["GET", "PUT"])
def analyzeIIhandler():
  IIModel = trainInvestabilityIndexModel()
  computeInvestabilityIndex(IIModel)
  return "Success"

@app.route("/", defaults={"path": ""})
@app.route("/<path>")
def notFoundHandler(path):
  return Response(status = 404)

######### Scheduling Stuff #########
## Potentially unnecessary
def with_logging(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print('LOG: Running job "%s"' % func.__name__)
        result = func(*args, **kwargs)
        print('LOG: Job "%s" completed' % func.__name__)
        return result
    return wrapper

## Job Scheduling
@with_logging
def deployNightlyJob():
  status1 = getAVData(app.PricedataCollection)
  status2 = getIEXData(app.CompanyInformationCollection)
  status3 = analyzeHandler()
  status4 = analyzeIIhandler()

  with open('log.txt', 'a') as f:
      f.write("I'm working: " + str(time.time()))

  if (status1 == 0 & status2 == 0 & status3 == "called analyzeHandler()" & status4 == "Success"):
    return 0
  else:
    return 1

## TEST
@with_logging
def job():
    with open('log.txt', 'a') as f:
      f.write("I'm working...")

# THIS IS UTC TIME (03 UTC = 20 PST = 8PM PST)
schedule.every().day.at("03:00:00").do(deployNightlyJob)
while True:
  schedule.run_pending()
  time.sleep(1)

######### END #########

if __name__ == "__main__":
  app.run("0.0.0.0", os.getenv("PORT", 4000))
