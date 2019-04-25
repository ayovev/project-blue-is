import os

DATABASE_URI = None

if os.getenv("PYTHON_ENV") == "production":
  PREFIX = "mongodb+srv"
  USERNAME = os.getenv("DATABASE_USERNAME")
  PASSWORD = os.getenv("DATABASE_PASSWORD")
  HOST = os.getenv("DATABASE_HOST")
  NAME = os.getenv("DATABASE_NAME")
  PARAMETERS = "retryWrites=true"

  DATABASE_URI = "{}://{}:{}@{}/{}?{}".format(PREFIX, USERNAME, PASSWORD, HOST, NAME, PARAMETERS)
else:
  PREFIX = "mongodb"
  HOST = "mongo"
  PORT = 27017
  NAME = "ieen"

  DATABASE_URI = "{}://{}:{}/{}".format(PREFIX, HOST, PORT, NAME)

import requests
import pandas as pd
import json
import time

def getAVData(database):
  KEY = os.getenv('ALPHAVANTAGE_API_KEY')
  DOWSymbols = pd.read_csv('DOW30.csv', header=None)
  DOWSymbols = DOWSymbols.iloc[:,0].values.tolist()
  DOWSymbols.append('SPY')
  DOWSymbols.append('MU')

  for symbol in DOWSymbols:
    URL = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol={}&apikey={}&outputsize=full".format(symbol, KEY)
    r = requests.get(URL)
    data = r.json()
    status = r.status_code

    if status != 200:
      return "Non 200 status code on symbol: {}".format(symbol)

    stringData = str(data)
    stringData = stringData.replace('Meta Data', "metadata")
    stringData = stringData.replace('1. Information', "information")
    stringData = stringData.replace('2. Symbol', "symbol")
    stringData = stringData.replace('3. Last Refreshed', "lastRefreshed")
    stringData = stringData.replace('4. Output Size', "outputSize")
    stringData = stringData.replace('5. Time Zone', "timeZone")
    stringData = stringData.replace('Time Series (Daily)', "data")
    stringData = stringData.replace('1. open', "open")
    stringData = stringData.replace('2. high', "high")
    stringData = stringData.replace('3. low', "low")
    stringData = stringData.replace('4. close', "close")
    stringData = stringData.replace('5. adjusted close', "adjustedClose")
    stringData = stringData.replace('6. volume', "volume")
    stringData = stringData.replace('7. dividend amount', "dividendAmount")
    stringData = stringData.replace('8. split coefficient', "splitCoefficient")
    data = stringData.replace("'", "\"")
    data = json.loads(data)


    query = {"metadata.symbol" : symbol}
    database.replace_one(query, data, True)

    time.sleep(15)

  return "success"

def getIEXData(database):
  KEY = os.getenv('IEX_API_KEY')
  DOWSymbols = pd.read_csv('DOW30.csv', header=None)
  DOWSymbols = DOWSymbols.iloc[:,0].values.tolist()
  DOWSymbols.append('SPY')
  DOWSymbols.append('MU')

  for symbol in DOWSymbols:
    URL = "https://cloud.iexapis.com/stable/stock/{}/company?token={}&filter=symbol,companyName,exchange,sector,industry,tags,description".format(symbol, KEY)
    r = requests.get(URL)
    companyData = r.json()

    URL = "https://cloud.iexapis.com/stable/stock/{}/logo?token={}".format(symbol, KEY)
    r = requests.get(URL)
    logoData = r.json()

    URL = "https://cloud.iexapis.com/stable/stock/{}/news/last?token={}".format(symbol, KEY)
    r = requests.get(URL)
    newsData = r.json()

    URL = "https://cloud.iexapis.com/stable/stock/{}/peers?token={}".format(symbol, KEY)
    r = requests.get(URL)
    peersData = r.json()

    companyData['logo'] = logoData['url']
    companyData['news'] = newsData
    companyData['peers'] = peersData

    query = {"symbol" : symbol}
    database.replace_one(query, companyData, True)

  return "success"

