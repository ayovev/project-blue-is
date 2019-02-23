'''dependencies'''
import math
from pymongo import MongoClient
import json
import pandas as pd
import numpy as np
from scipy.stats import norm
from sklearn import linear_model

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
  def loadHistorical(ticker):
    '''
    load historical data for class attribute - ticker

    @return bool set to true if functions completes
    '''
    if (ticker == ""):
      cursor = Var.collection.find_one()
      tName = cursor['MetaData']['2Symbol']
      tData = cursor['TimeSeries(Daily)']
    else:
      cursor = Var.collection.find_one({"MetaData.2Symbol" : "SPY"}) # Query for SPY
      tName = cursor['MetaData']['2Symbol']
      tData = cursor['TimeSeries(Daily)']

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

    # calculate percent returns per day
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

  @staticmethod
  def calculateBeta(tName, tData, bData):
    '''
    Class method to calculate the Beta of a given ticker

    @return Beta value
    '''
    # make data into a pandas data frame
    df = pd.DataFrame.from_dict(tData)
    df = df.T
    df = df.iloc[::-1]

    # calculate percent returns per day for stock
    pReturns = pd.to_numeric(df.iloc[:, 4]).pct_change()

    # get the benchmark percentage returns per day and get the std + variance
    df2 = pd.DataFrame.from_dict(bData)
    df2 = df2.T
    df2 = df2.iloc[::-1]

    bReturns = pd.to_numeric(df2.iloc[:, 4]).pct_change()

    numerator = bReturns.cov(pReturns)
    denominator = np.std(bReturns) ** 2

    return {"Beta" : float(numerator/denominator)}

  @staticmethod
  def calculateSD(tName, tData):
    '''
    SD of percent returns
    '''
    # make data into a pandas data frame
    df = pd.DataFrame.from_dict(tData)
    df = df.T
    df = df.iloc[::-1]

    # calculate percent returns per day for stock
    pReturns = pd.to_numeric(df.iloc[:, 4]).pct_change()

    pr_std = np.std(pReturns)

    return {"Standard Deviation of percent returns" : float(pr_std)}


  @staticmethod
  def calculateR2(tName, tData, bData)
    '''
    Class method to calculate the r2 of a stock (w/ SPY)
    '''

    # make data into a pandas data frame
    df = pd.DataFrame.from_dict(tData)
    df = df.T
    df = df.iloc[::-1]

    # calculate percent returns per day for stock
    pReturns = pd.to_numeric(df.iloc[:, 4]).pct_change()

    # get the benchmark percentage returns per day and get the std + variance
    df2 = pd.DataFrame.from_dict(bData)
    df2 = df2.T
    df2 = df2.iloc[::-1]

    bReturns = pd.to_numeric(df2.iloc[:, 4]).pct_change()

    lm = linear_model.LinearRegression()

    # Train the model
    lm.fit(bReturns, pReturns)

    return lm




