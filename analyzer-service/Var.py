'''dependencies'''
import math
from pymongo import MongoClient
import json
import pandas as pd
import numpy as np
from scipy.stats import norm

'''local class imports'''
from DBInterface import DBInterface

class Var:
  '''Value at Risk for single security'''

  ticker = "XYZ"
  client, collection = DBInterface.connect() #need try catch here

  @staticmethod
  def setTicker(newTicker):
    '''
    set ticker for loading historical data -- to be used in future versions

    @return bool set to true if functions completes
    '''
    Var.ticker = newTicker
    return True

  @staticmethod
  def loadHistorical():
    '''
    load historical data for class attribute - ticker

    @return bool set to true if functions completes
    '''
    cursor = Var.collection.find_one()
    tName = cursor['Meta Data']['2. Symbol']
    tData = cursor['Time Series (Daily)']
    return (tName, tData)

  @staticmethod
  def calculateVar(tName, tData):
    '''
    Class method to calculate the Value at Risk using the Variance/Covaraiance method

    @return dict containing ticker symbol and 3 levels of value at risk (90, 95, 99)
    '''
    # make data into a pandas data frame
    df = pd.DataFrame.from_dict(tData)
    df = df.T
    df = df.iloc[::-1]

    # caculate percent returns per day
    pReturns = pd.to_numeric(df.iloc[:, 4]).pct_change()

    # calculate the percent return's mean and s.d.
    pr_mean = np.mean(pReturns)
    pr_std = np.std(pReturns)

    # use normal distribution percentile function to get Value at Risk (90, 95, 99)
    VaR_90 = norm.ppf(.1, pr_mean, pr_std)
    VaR_95 = norm.ppf(.05, pr_mean, pr_std)
    VaR_99 = norm.ppf(.01, pr_mean, pr_std)

    returnDict = {"Ticker" : tName, "Value at Risk 90%" : round(VaR_90, 4), "Value at Risk 95%" : round(VaR_95, 4), "Value at Risk 99%" : round(VaR_99, 4)}

    return returnDict
