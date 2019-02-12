"""dependencies"""
import os
import requests
from pymongo import MongoClient

class DBInterface:
  """class used to interface with cloud mongo database instance"""

  TICKERS = ["MU", "AAPL", "GPRO", "TSLA"]
  KEY = os.getenv("ALPHAVANTAGE_API_KEY")

  @staticmethod
  def connect():
    """
    connect to cloud database

    @return tuple connection to client with collection
    """

    PREFIX = "mongodb://"
    USERNAME = str(os.getenv("DATABASE_USERNAME"))
    PASSWORD = str(os.getenv("DATABASE_PASSWORD"))
    URI = "@cluster0-shard-00-00-ialvl.mongodb.net:27017,cluster0-shard-00-01-ialvl.mongodb.net:27017,cluster0-shard-00-02-ialvl.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"

    client = MongoClient(PREFIX + USERNAME + ":" + PASSWORD + URI)
    db = client['pbi-data']
    collection = db.tickerData
    return (client, collection)


  @staticmethod
  def disconnect(client):
    """
    disconnect from cloud database

    @return boolean result of operation
    """
    client.close()
    return True

  @staticmethod
  def getHistoricalData():
    """
    load data into cloud database

    @return boolean result of operation
    """

    client, collection = DBInterface.connect()

    for ticker in DBInterface.TICKERS:
      tickerJSON = requests.get(
        "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol={}&outputsize={}&apikey={}".format(ticker, "full", DBInterface.KEY))

      collection.insert({"data": tickerJSON.json()}, check_keys=False)
      print(ticker, "historical data has been inserted.")

    DBInterface.disconnect(client)
    return "Historical data has been input into the cloud mongoDB instance!"
