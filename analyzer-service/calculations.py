import numpy as np
import pandas as pd
from scipy.stats import norm
import statsmodels.api as sm
from datetime import datetime

import time

from app import app

def filterData(symbolData):
  #start = time.time() ### test

  df = pd.DataFrame.from_dict(symbolData)
  df = df.T
  df.reset_index(level=0, inplace=True)

  current_date = datetime.today()
  filterDate = (current_date - pd.Timedelta(weeks=26)) - pd.Timedelta(days=1)

  #time1 = time.time() ### test

  df = df.loc[0:180,:]
  for i in range(len(df.loc[:, 'index'])):
    df.loc[i,'index'] = datetime.strptime(df.loc[i,'index'] , '%Y-%m-%d')

  #time2 = time.time() ### test

  resultsDF = df.loc[df['index'] > filterDate]
  return resultsDF

  # TEST
  #end = time.time() ### test
  #string = "Init calcs: {} \nFor loop: {}\nFilter: {}\nFull function: {}".format(time1-start, time2-time1, end-time2, end-start)
  #return string


def sixMonthReturn(df):
  i = len(df.loc[:, 'index']) - 1
  change = pd.to_numeric(df.iloc[i, 5]) -  pd.to_numeric(df.iloc[0, 5])
  pctChange = change / pd.to_numeric(df.iloc[0, 5])
  return round(pctChange, 4)


def loadHistorical(symbol):
  collection = app.PricedataCollection
  result = collection.find_one({"metadata.symbol": "{}".format(symbol)})
  data = result["data"]

  return data

def getPctReturns(symbolData):
  pReturns = pd.to_numeric(symbolData.iloc[:, 5]).pct_change()
  return pReturns


def calculateValueAtRisk(pReturns):
  # calculate the percent return's mean and s.d.
  pr_mean = np.mean(pReturns)
  pr_std = np.std(pReturns)

  # use normal distribution percentile function to get Value at Risk (90, 95, 99)
  VaR_90 = norm.ppf(.1, pr_mean, pr_std)
  VaR_95 = norm.ppf(.05, pr_mean, pr_std)
  VaR_99 = norm.ppf(.01, pr_mean, pr_std)

  returnDict = {"Value at Risk 90%" : round(VaR_90, 4), "Value at Risk 95%" : round(VaR_95, 4), "Value at Risk 99%" : round(VaR_99, 4)}

  return returnDict


def calculateBeta(pReturns, bReturns):

  numerator = bReturns.cov(pReturns)
  denominator = np.std(bReturns) ** 2

  return round(float(numerator/denominator), 4)


def calculateStandardDeviation(pReturns):

  pr_std = np.std(pReturns)
  return round(float(pr_std), 4)


def calculateRSquared(pReturns, bReturns):
  pReturns = pReturns[1:]
  bReturns = bReturns[1:]

  model = sm.OLS(pReturns, bReturns).fit()

  return round(model.rsquared, 4)


def calculateExpectedReturn(indexData, symbolBeta):
  # CAPM = rf + B(rm - rf)
  rf = 0.025 # risk free rate of 2.5%

  # find market return
  rm = sixMonthReturn(indexData)

  #CAPM = rf + B(rm - rf)
  CAPM = rf + symbolBeta * (rm - rf)

  return round(CAPM, 4)


def calculateSharpeRatio(symbolER, symbolSD):
  # Sharpe = r_stock - rf / (sd of returns)
  rf = 0.025
  sharpe = (symbolER - rf) / symbolSD
  return round(sharpe,2)
