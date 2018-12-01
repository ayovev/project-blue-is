"""dependencies"""
from datetime import datetime, timezone, timedelta
from flask import Flask, jsonify
import os
import sys
from dotenv import load_dotenv
load_dotenv()

from DBInterface import DBInterface
from Seeder import Seeder
from Var import Var

app = Flask("analyzer-service")
app.config["ENV"] = "development"
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

  @return object status of current service
  """

  # TODO: refactor for easy reuse
  timezoneOffset = timezone(offset=timedelta(hours=-7))
  return jsonify({
    "datetime": datetime.now(tz=timezoneOffset).strftime("%Y-%m-%d %H:%M:%S"),
    "service": "analyzer-service",
    "operation": "statusCheck",
    "status": 200
  })

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

  # TODO: refactor for easy reuse
  timezoneOffset = timezone(offset=timedelta(hours=-7))
  return jsonify({
    "datetime": datetime.now(tz=timezoneOffset).strftime("%Y-%m-%d %H:%M:%S"),
    "service": "analyzer-service",
    "operation": "databaseDeploy",
    "status": 200
  })

@app.route("/seeder/redeploy")
def redeploy():
  """
  Redeploy local database with new compact set of sample data

  @return string string confirmation of seeding
  """

  Seeder.redeploy()

  # TODO: refactor for easy reuse
  timezoneOffset = timezone(offset=timedelta(hours=-7))
  return jsonify({
    "datetime": datetime.now(tz=timezoneOffset).strftime("%Y-%m-%d %H:%M:%S"),
    "service": "analyzer-service",
    "operation": "databaseRedeploy",
    "status": 200
  })

@app.route("/analyzer/var")
def valueAtRisk():
  '''value at risk'''
  ticker, data = Var.loadHistorical()
  test = Var.calculateVar(ticker, data)

  print(test, file=sys.stderr)

  return "Success"

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=4000)
