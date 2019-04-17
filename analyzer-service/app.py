from flask import Flask, Response, jsonify
import os
from pymongo import MongoClient

import time

from calculations import *
from database import DATABASE_URI

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
  return "Flask root"

@app.route("/status", methods = ["GET"])
def statusHandler():
  status = app.Database.command("ping")
  ok = bool(status["ok"])

  if not ok:
    return Response(status = 503)

  return Response(status = 200)

@app.route("/analyze", methods = ["PUT"])
def analyzeHandler():
  return "called analyzeHandler()"

@app.route("/analyze/<symbol>", methods = ["GET", "PUT"])
def analyzeSymbolHandler(symbol):
  symbolData = loadHistorical(symbol)
  indexData = loadHistorical(index)

  valueAtRisk = calculateValueAtRisk(symbolData)
  beta = calculateBeta(symbolData, indexData)
  standardDeviation = calculateStandardDeviation(symbolData)
  rSquared = calculateRSquared(symbolData, indexData)
  expectedReturn = calculateExpectedReturn(symbolData, indexData)
  sharpeRatio = calculateSharpeRatio(symbolData, indexData)

  return "called analyzeSymbolHandler() for {}".format(symbol)

@app.route("/", defaults={"path": ""})
@app.route("/<path>")
def notFoundHandler(path):
  return Response(status = 404)

if __name__ == "__main__":
  app.run("0.0.0.0", os.getenv("PORT", 4000))
