import math
from pymongo import MongoClient
import json
import pandas as pd

from DBInterface import DBInterface

class Var:
  '''Value at Risk for single security'''

  ticker = "XYZ"
  client, collection = DBInterface.connect() #need try catch here

  @staticmethod
  def setTicker(newTicker):
    Var.ticker = newTicker
    return True

  @staticmethod
  def loadHistorical():
    cursor = Var.collection.find_one()
    tName = cursor['data']['Meta Data']['2. Symbol']
    tData = cursor['data']['Time Series (Daily)']
    return (tName, tData)

  @staticmethod
  def calculateVar(tName, tData):
    # make data into a pandas data frame
    df = pd.DataFrame.from_dict(tData)
    df = df.T

    # caculate percent returns per day
    #returns = pd.to_numeric(df.iloc[:, 3]) - pd.to_numeric(df.iloc[:, 0])
    #pReturns = returns / pd.to_numeric(pd.to_numeric(df.iloc[:, 0]))



    return str(df)
