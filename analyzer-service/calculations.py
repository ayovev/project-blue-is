import numpy as np
import pandas as pd
from scipy.stats import norm
import statsmodels.api as sm
from datetime import datetime

from app import app

def filterData(symbolData):
  df = pd.DataFrame.from_dict(symbolData)
  df = df.T
  df.reset_index(level=0, inplace=True)
  x = df.loc[:,'index']
  current_date = datetime.today()
  filterDate = (current_date - pd.Timedelta(weeks=26)) - pd.Timedelta(days=1)

  for i in range(len(df.loc[:, 'index'])):
    df.loc[i,'index'] = datetime.strptime(df.loc[i,'index'] , '%Y-%m-%d')

  return df.loc[df['index'] > filterDate]


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


def calculateValueAtRisk(symbolData):
  # make data into a pandas data frame
  df = filterData(symbolData)
  df = df.iloc[::-1]

  # calculate percent returns per day
  pReturns = pd.to_numeric(df.iloc[:, 5]).pct_change()

  # calculate the percent return's mean and s.d.
  pr_mean = np.mean(pReturns)
  pr_std = np.std(pReturns)

  # use normal distribution percentile function to get Value at Risk (90, 95, 99)
  VaR_90 = norm.ppf(.1, pr_mean, pr_std)
  VaR_95 = norm.ppf(.05, pr_mean, pr_std)
  VaR_99 = norm.ppf(.01, pr_mean, pr_std)

  returnDict = {"Value at Risk 90%" : round(VaR_90, 4), "Value at Risk 95%" : round(VaR_95, 4), "Value at Risk 99%" : round(VaR_99, 4)}

  return returnDict


def calculateBeta(symbolData, indexData):
  # make data into a pandas data frame
  df = filterData(symbolData)
  df = df.iloc[::-1]

  # calculate percent returns per day for stock
  pReturns = pd.to_numeric(df.iloc[:, 5]).pct_change()

  # get the benchmark percentage returns per day and get the std + variance
  df2 = filterData(indexData)
  df2 = df2.iloc[::-1]

  bReturns = pd.to_numeric(df2.iloc[:, 5]).pct_change()

  numerator = bReturns.cov(pReturns)
  denominator = np.std(bReturns) ** 2

  return {"Beta" : round(float(numerator/denominator), 4)}


def calculateStandardDeviation(symbolData):
  # make data into a pandas data frame
  df = filterData(symbolData)
  df = df.iloc[::-1]

  # calculate percent returns per day for stock
  pReturns = pd.to_numeric(df.iloc[:, 5]).pct_change()

  pr_std = np.std(pReturns)

  return {"Standard Deviation of percent returns" : round(float(pr_std), 4)}



def calculateRSquared(symbolData, indexData):
  # make data into a pandas data frame
  df = filterData(symbolData)
  df = df.iloc[::-1]

  # calculate percent returns per day for stock
  pReturns = pd.to_numeric(df.iloc[:, 5]).pct_change()
  pReturns = pReturns[1:]

  # get the benchmark percentage returns per day
  df2 = filterData(indexData)
  df2 = df2.iloc[::-1]

  bReturns = pd.to_numeric(df2.iloc[:, 5]).pct_change()
  bReturns = bReturns[1:]

  model = sm.OLS(pReturns, bReturns).fit()

  return {"R-Squared: {}".format(round(model.rsquared, 4))}


def calculateExpectedReturn(symbolData, indexData):
  # CAPM = rf + B(rm - rf)
  # ------------------------
  rf = 0.025 # risk free rate of 2.5%

  # get the benchmark percentage returns per day
  df2 = filterData(indexData)
  df2 = df2.iloc[::-1]

  # find market return
  rm = sixMonthReturn(df2)

  # find Beta of tName
  tBeta = calculateBeta(symbolData, indexData)

  #CAPM = rf + B(rm - rf)
  CAPM = rf + tBeta["Beta"] * (rm - rf)

  return {"CAPM E(R)" : round(CAPM, 4)}


def calculateSharpeRatio(symbolData, indexData):
  # Sharpe = r_stock - rf / (sd of returns)
  rf = 0.025
  r_stock = calculateExpectedReturn(symbolData, indexData)
  sd = calculateStandardDeviation(symbolData)
  sharpe = (r_stock["CAPM E(R)"] - rf) / sd["Standard Deviation of percent returns"]
  return {"Sharpe Ratio" : round(sharpe,2)}
