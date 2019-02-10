"""dependencies"""
import os
from flask import Flask, Response

from DBInterface import DBInterface
from Seeder import Seeder
from Var import Var

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

@app.route("/analyzer/var")
def valueAtRisk():
  '''value at risk'''
  ticker, data = Var.loadHistorical()
  test = Var.calculateVar(ticker, data)

  return str(test)

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=os.getenv(key="PORT", default=4000))
