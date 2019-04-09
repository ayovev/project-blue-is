'''dependencies'''
import numpy as np
import pandas as pd
from scipy.stats import norm
import statsmodels.api as sm
from datetime import datetime

from DBInterface import DBInterface

class Calc:
  '''Value at Risk for single security'''

  ticker = "XYZ"
  client, collection = DBInterface.connect() #need try catch here

  @staticmethod
  def filterData(tData):
    df = pd.DataFrame.from_dict(tData)
    df = df.T
    df.reset_index(level=0, inplace=True)
    x = df.loc[:,'index']
    current_date = datetime.today()
    filterDate = (current_date - pd.Timedelta(weeks=26)) - pd.Timedelta(days=1)

    for i in range(len(df.loc[:, 'index'])):
      df.loc[i,'index'] = datetime.strptime(df.loc[i,'index'] , '%Y-%m-%d')

    return df.loc[df['index'] > filterDate]

  @staticmethod
  def sixMonthReturn(df):
    i = len(df.loc[:, 'index']) - 1
    change = pd.to_numeric(df.iloc[i, 5]) -  pd.to_numeric(df.iloc[0, 5])
    pctChange = change / pd.to_numeric(df.iloc[0, 5])
    return round(pctChange, 4)

  @staticmethod
  def setTicker(newTicker):
    '''
    set ticker for loading historical data -- to be used in future versions

    @return bool set to true if functions completes
    '''
    Calc.ticker = newTicker
    return True

  @staticmethod
  def loadHistorical(ticker):
    '''
    load historical data for class attribute - ticker

    @return bool set to true if functions completes
    '''
    cursor = Calc.collection.find_one({"MetaData.2Symbol" : "{}".format(ticker)})
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
    df = Calc.filterData(tData)
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

    returnDict = {"Ticker" : tName, "Value at Risk 90%" : round(VaR_90, 4), "Value at Risk 95%" : round(VaR_95, 4), "Value at Risk 99%" : round(VaR_99, 4)}

    return returnDict

  @staticmethod
  def calculateBeta(tName, tData, bData):
    '''
    Class method to calculate the Beta of a given ticker

    @return Beta value
    '''
    # make data into a pandas data frame
    df = Calc.filterData(tData)
    df = df.iloc[::-1]

    # calculate percent returns per day for stock
    pReturns = pd.to_numeric(df.iloc[:, 5]).pct_change()

    # get the benchmark percentage returns per day and get the std + variance
    df2 = Calc.filterData(bData)
    df2 = df2.iloc[::-1]

    bReturns = pd.to_numeric(df2.iloc[:, 5]).pct_change()

    numerator = bReturns.cov(pReturns)
    denominator = np.std(bReturns) ** 2

    return {"Beta" : round(float(numerator/denominator), 4)}

  @staticmethod
  def calculateSD(tName, tData):
    '''
    SD of percent returns
    '''
    # make data into a pandas data frame
    df = Calc.filterData(tData)
    df = df.iloc[::-1]

    # calculate percent returns per day for stock
    pReturns = pd.to_numeric(df.iloc[:, 5]).pct_change()

    pr_std = np.std(pReturns)

    return {"Standard Deviation of percent returns" : round(float(pr_std), 4)}


  @staticmethod
  def calculateR2(tName, tData, bData):
    '''
    Class method to calculate the r2 of a stock (w/ SPY)
    '''

    # make data into a pandas data frame
    df = Calc.filterData(tData)
    df = df.iloc[::-1]

    # calculate percent returns per day for stock
    pReturns = pd.to_numeric(df.iloc[:, 5]).pct_change()
    pReturns = pReturns[1:]

    # get the benchmark percentage returns per day
    df2 = Calc.filterData(bData)
    df2 = df2.iloc[::-1]

    bReturns = pd.to_numeric(df2.iloc[:, 5]).pct_change()
    bReturns = bReturns[1:]

    model = sm.OLS(pReturns, bReturns).fit()

    return {"R-Squared: {}".format(tName, round(model.rsquared, 4))}

  @staticmethod
  def calculateER(tName, tData, bData):
    '''
    Class methodo to calculate the CAPM expected return
    '''
    # CAPM = rf + B(rm - rf)
    # ------------------------
    rf = 0.025 # risk free rate of 2.5%

    # get the benchmark percentage returns per day
    df2 = Calc.filterData(bData)
    df2 = df2.iloc[::-1]

    # find market return
    rm = Calc.sixMonthReturn(df2)

    # find Beta of tName
    tBeta = Calc.calculateBeta(tName, tData, bData)

    #CAPM = rf + B(rm - rf)
    CAPM = rf + tBeta["Beta"] * (rm - rf)

    return {"CAPM E(R)" : round(CAPM, 4)}

  @staticmethod
  def calculateSharpeRatio(tName, tData, bData):
    # Sharpe = r_stock - rf / (sd of returns)
    rf = 0.025
    r_stock = Calc.calculateER(tName, tData, bData)
    sd = Calc.calculateSD(tName, tData)
    sharpe = (r_stock["CAPM E(R)"] - rf) / sd["Standard Deviation of percent returns"]
    return {"Sharpe Ratio" : round(sharpe,2)}
