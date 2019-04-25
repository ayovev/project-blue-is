import numpy as np
import pandas as pd
from scipy.stats import norm
import statsmodels.api as sm
from datetime import datetime
from sklearn.svm import SVC

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

  df = df.loc[0:130,:]
  for i in range(len(df.loc[:, 'index'])):
    df.loc[i,'index'] = datetime.strptime(df.loc[i,'index'] , '%Y-%m-%d')

  #time2 = time.time() ### test

  resultsDF = df.loc[df['index'] > filterDate]
  return resultsDF

  # TEST
  # end = time.time() ### test
  # string = "Init calcs: {} \nFor loop: {}\nFilter: {}\nFull function: {}".format(time1-start, time2-time1, end-time2, end-start)
  # return string


def sixMonthReturn(df):
  i = len(df.loc[:, 'index']) - 1
  change = pd.to_numeric(df.iloc[i, 5]) -  pd.to_numeric(df.iloc[0, 5])
  pctChange = change / pd.to_numeric(df.iloc[0, 5])
  return round(pctChange, 4)


def loadHistorical(symbol):
  collection = app.PricedataCollection
  result = collection.find_one({"metadata.symbol": symbol})
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

  return round(VaR_95, 4)


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

####################################################################
## Investability Index Functions
'''
Algorithm
---------
Step 1: For all the tickers pull the last 12 months of data split into 6 month chunks
Step 2: For Each: did the ticker beat the SP500 in the second chunk? (label)
Step 3: For Each: Calculate the 6 calcs for the first 6 month chunk
Step 4: Train Classification model
Step 5: For Each: Test on second chunk with calc values from the db
Step 6: For Each: Output probability
Step 7: For Each: Write value to db
'''

def modifiedFilterData(symbolData):
  # modified to get 6 month chunk from 1 year ago to 6 months ago
  df = pd.DataFrame.from_dict(symbolData)
  df = df.T
  df.reset_index(level=0, inplace=True)

  current_date = datetime.today()
  sixMonthDate = (current_date - pd.Timedelta(weeks=26)) - pd.Timedelta(days=1)
  yearDate = (current_date - pd.Timedelta(days=365)) - pd.Timedelta(days=1)

  df = df.loc[0:300,:]
  for i in range(len(df.loc[:, 'index'])):
    df.loc[i,'index'] = datetime.strptime(df.loc[i,'index'] , '%Y-%m-%d')

  resultsDF = df.loc[(df['index'] > yearDate) & (df['index'] < sixMonthDate)]
  return resultsDF

def trainInvestabilityIndexModel():
  # Step 1: Pull data from load historical
  symbols = pd.read_csv('DOW30.csv', header=None)
  symbols = symbols.iloc[:,0].values.tolist()
  symbols.append('SPY')
  symbols.append('MU')

  # Get data for recent 6 month chunk
  indexData = loadHistorical('SPY')
  indexDataRecent = filterData(indexData)
  indexDataRecent = indexDataRecent.iloc[::-1]

  # Get SPY return over last 6 months
  r_spy = sixMonthReturn(indexDataRecent)

  # Get data for old 6 mon chunk (used in calcs)
  indexDataOld = modifiedFilterData(indexData)
  indexDataOld = indexDataOld.iloc[::-1]
  bReturnsTrain = getPctReturns(indexDataOld)

  datasetTrain = pd.DataFrame(columns=['Symbol','VaR', 'B', 'SD', 'r2', 'ER', 'SR', 'isBeat'])
  # Step 2: Get SPY+tickers return for next 6 month period, label if beat or not
  # Step 3: Call the analysis handler for train calcs + create dataframe
  for ticker in symbols:
    tickerData = loadHistorical(ticker)
    tickerData = modifiedFilterData(tickerData)
    tickerData = tickerData.iloc[::-1]
    pReturnsTrain = getPctReturns(tickerData)
    r_symbol = sixMonthReturn(tickerData)

    valueAtRisk = calculateValueAtRisk(pReturnsTrain)
    beta = calculateBeta(pReturnsTrain, bReturnsTrain)
    standardDeviation = calculateStandardDeviation(pReturnsTrain)
    rSquared = calculateRSquared(pReturnsTrain, bReturnsTrain)
    expectedReturn = calculateExpectedReturn(indexDataOld, beta)
    sharpeRatio = calculateSharpeRatio(expectedReturn, standardDeviation)
    isBeat = r_symbol > r_spy

    insertList = [ticker, valueAtRisk, beta, standardDeviation, rSquared, expectedReturn, sharpeRatio, isBeat]
    datasetTrain.loc[len(datasetTrain)] = insertList

  # Machine Learning Preprocessing
  X_train = datasetTrain.iloc[:, 1:7]
  y_train = datasetTrain.iloc[:, 7]
  y_train=y_train.astype('bool')

  # Feature Scaling
  # from sklearn.preprocessing import StandardScaler
  # sc = StandardScaler()
  # X_train = sc.fit_transform(X_train)
  # X_test = sc.transform(X_test)

  # Step 4: Train the SVC on the dataframe w/ labels
  # Fitting classifier to the Training set
  prob_classifier = SVC(kernel = 'rbf', probability=True)
  prob_classifier.fit(X_train, y_train)

  # Return trained model
  return prob_classifier


def computeInvestabilityIndex(trainedModel):
  # Step 5: Run predict on each ticker with 6 calcs from db
  # Step 6: Output probability
  # Step 7: Truncate and write probability to the corresponding collection
  # Return status complete

  # Build test data
  datasetTest = pd.DataFrame(columns=['Symbol','VaR', 'B', 'SD', 'r2', 'ER', 'SR'])

  symbols = pd.read_csv('DOW30.csv', header=None)
  symbols = symbols.iloc[:,0].values.tolist()
  symbols.append('SPY')
  symbols.append('MU')

  collection = app.AnalysisCollection
  returnDict = {}

  for symbol in symbols:
    result = collection.find_one({"symbol": symbol})

    valueAtRisk = result['valueAtRisk']
    beta = result['beta']
    standardDeviation = result['standardDeviation']
    rSquared = result['rSquared']
    expectedReturn = result['expectedReturn']
    sharpeRatio = result['sharpeRatio']

    insertList = [symbol, valueAtRisk, beta, standardDeviation, rSquared, expectedReturn, sharpeRatio]
    datasetTest.loc[len(datasetTest)] = insertList

  X_test = datasetTest.iloc[:, 1:7]
  isBeat = trainedModel.predict_proba(X_test)

  i = 0
  for symbol in symbols:
    IIValue = '%.2f'%(float(isBeat[i][0]))
    i = i + 1
    query = {"symbol" : symbol}
    collection.update_one(query, { "$set": { "investabilityIndex": float(IIValue)}})
