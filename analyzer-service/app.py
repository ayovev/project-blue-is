from flask import Flask, Response, jsonify
import os
from pymongo import MongoClient
import schedule
import time
import threading

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
  alphavantageStatus = getAVData(app.PricedataCollection)
  iexStatus = getIEXData(app.CompanyInformationCollection)
  return iexStatus

@app.route("/status", methods = ["GET"])
def statusHandler():
  status = app.Database.command("ping")
  ok = bool(status["ok"])

  if not ok:
    return Response(status = 503)

  return Response(status = 200)

@app.route("/analyze", methods = ["PUT", "GET"])
def analyzeHandler():
  symbols = pd.read_csv('S&P500.csv', header=None)
  symbols = symbols.iloc[:,0].values.tolist()
  symbols.append('SPY')

  alreadyInserted = app.AnalysisCollection.find({})
  alreadyInsertedList = []

  for document in alreadyInserted:
    alreadyInsertedList.append(document["symbol"])

  symbols = list(set(symbols) - set(alreadyInsertedList))

  with open("all.log", "a+") as f:
    for symbol in symbols:
      f.write("Analyzing symbol {}\n".format(symbol))
      f.flush()

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

  return True

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

  return True

@app.route('/analyze/II', methods = ["GET", "PUT"])
def analyzeIIhandler():
  # IIModel = trainInvestabilityIndexModel()
  computeInvestabilityIndex(0)
  return True

@app.route("/", defaults={"path": ""})
@app.route("/<path>")
def notFoundHandler(path):
  return Response(status = 404)

def deployNightlyJob():
  # with open('all.log', 'a+') as f:
  # f.write("I'm starting nightly job at: " + str(time.time()) + "\n")
  status1 = getAVData(app.PricedataCollection)
  # f.write("Got AV Data Bossman\n")
  # status2 = getIEXData(app.CompanyInformationCollection)
  # f.write("Got IEX Data Bossman\n")
  # status3 = analyzeHandler()
  # f.write("Analyzed Data Bossman\n")
  # status4 = analyzeIIhandler()
  # f.write("Constructed II Bossman\n")
  # f.write("Nightly job completed at: " + str(time.time()))

  if (status1 == True & status2 == True & status3 == True & status4 == True):
    return True
  else:
    return False

def scheduleCheck():
  while True:
    schedule.run_pending()
    time.sleep(60)

# schedule.every().day.at("04:30:00").do(deployNightlyJob)
# schedule.every().minute.do(deployNightlyJob)
# myThread = threading.Thread(target=scheduleCheck)
# myThread.start()

if __name__ == "__main__":
  app.run("0.0.0.0", os.getenv("PORT", 4000))
