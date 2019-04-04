"""dependencies"""
import os
from flask import Flask, Response

from DBInterface import DBInterface
from Seeder import Seeder
from Var import Calc

app = Flask("analyzer-service")

env = os.getenv(key="PYTHON_ENV")
app.config["ENV"] = env

if env == "development":
  app.config["DEBUG"] = 1

@app.route("/")
def rootHandler():
  """
  Handler for requests to root route

  @return string test string
  """

  return "Flask root route"

@app.route("/status")
def statusHandler():
  """
  Handler for requests to status route

  @return 200 OK
  """
  return Response(status=200)

@app.route("/admin/getHistoricalData")
def historicalData():
  """
  Seed cloud database with full set of sample data

  @return string HTML confirmation of seeding
  """

  return DBInterface.getHistoricalData()

@app.route("/seeder/deploy")
def seed():
  """
  Seed local database with compact set of sample data

  @return string string confirmation of seeding
  """

  Seeder.deploy()

@app.route("/seeder/redeploy")
def redeploy():
  """
  Redeploy local database with new compact set of sample data

  @return string string confirmation of seeding
  """

  Seeder.redeploy()

@app.route("/analyzer/var/<ticker>")
def valueAtRisk(ticker):
  '''value at risk'''
  ticker, data = Calc.loadHistorical(ticker)
  test = Calc.calculateVar(ticker, data)

  return str(test)

@app.route("/analyzer/beta/<ticker>")
def calculateBeta(ticker):
  '''beta'''
  ticker, data = Calc.loadHistorical(ticker)
  bTicker, bData = Calc.loadHistorical("SPY")
  test = Calc.calculateBeta(ticker, data, bData)

  return str(test)

@app.route("/analyzer/sd/<ticker>")
def calculateSD(ticker):
  '''sd of returns'''
  ticker, data = Calc.loadHistorical(ticker)
  test = Calc.calculateSD(ticker, data)

  return str(test)

@app.route("/analyzer/r2/<ticker>")
def calculateR2(ticker):
  '''r2 of returns'''
  ticker, data = Calc.loadHistorical(ticker)
  bTicker, bData = Calc.loadHistorical("SPY")
  test = Calc.calculateR2(ticker, data, bData)

  return str(test)

@app.route("/analyzer/CAPM/<ticker>")
def calculateCAPM(ticker):
  '''CAPM E(r)'''
  ticker, data = Calc.loadHistorical(ticker)
  bTicker, bData = Calc.loadHistorical("SPY")
  test = Calc.calculateER(ticker, data, bData)
  return str(test)

@app.route("/analyzer/sharpe/<ticker>")
def calculateSharpe(ticker):
  '''Sharpe Ratio'''
  ticker, data = Calc.loadHistorical(ticker)
  bTicker, bData = Calc.loadHistorical("SPY")
  test = Calc.calculateSharpeRatio(ticker, data, bData)
  return str(test)

@app.route("/analyzer/test")
def testFunction():
  tick, data = Calc.loadHistorical("MU")
  df = Calc.filterData(data)
  test = Calc.sixMonthReturn(df.iloc[::-1])

  return str(test)

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=os.getenv(key="PORT", default=4000))
