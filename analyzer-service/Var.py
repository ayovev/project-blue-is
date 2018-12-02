import math
from pymongo import MongoClient
import json
import pandas as pd
import numpy as np
from scipy.stats import norm

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
    df = df.iloc[::-1]

    # caculate percent returns per day
    pReturns = pd.to_numeric(df.iloc[:, 4]).pct_change()
    pr_mean = np.mean(pReturns)
    pr_std = np.std(pReturns)

    return str(pr_std)
