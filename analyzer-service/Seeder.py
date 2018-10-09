"""dependencies"""
import os
import requests
from pymongo import MongoClient

# TODO: return booleans for class operations to indicate success or failure

class Seeder:
  """class used to manage local database seeding interactions"""

  TICKERS = ["MU", "AAPL", "GPRO", "TSLA"]
  KEY = os.getenv("ALPHA_VANTAGE_KEY")
  HOST = "mongo"
  PORT = 27017
  DATABASE = "ieen"
  COLLECTION = "seedData"

  @staticmethod
  def drop():
    """
    drop local database

    @return boolean result of operation
    """

    client = MongoClient(Seeder.HOST, Seeder.PORT)
    client.drop_database(Seeder.DATABASE)

  @staticmethod
  def deploy():
    """
    seed local database

    @param array list of tickers to seed data for
    @return boolean result of operation
    """

    client = MongoClient(Seeder.HOST, Seeder.PORT)

    # ideally these shouldn't be hard-coded
    db = client.ieen
    collection = db.seedData

    for ticker in Seeder.TICKERS:
      tickerJSON = requests.get(
        "https://www.alphavantage.co/query?"+
        "function=TIME_SERIES_DAILY&symbol={}&outputsize={}&apikey={}"
        .format(ticker, "compact", Seeder.KEY))
      collection.insert({"data": tickerJSON.json()}, check_keys=False)

    client.close()

  @staticmethod
  def redeploy():
    """
    redploy local database (drop and redeploy)

    @return boolean result of operation
    """
    Seeder.drop()
    Seeder.deploy()
