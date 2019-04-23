import numpy as np
import pandas as pd
from sklearn.svm import SVC
from app import app

'''
Algorithm
---------
Step 1: For all the tickers pull the last 12 months of data split into 6 month chunks
Step 2: For Each: did the ticker beat the SP500 in the first chunk? (label)
Step 3: For Each: Calculate the 6 calcs for the first 6 month chunk
Step 4: Train Classification model

Step 5: For Each: Test on second chunk with calc values from the db
Step 6: For Each: Output probability
Step 7: For Each: Write value to db
'''

def modifiedFilterData(symbolData):
  # need to modify to get 6 month chunk from 1 year ago to 6 months ago

  df = pd.DataFrame.from_dict(symbolData)
  df = df.T
  df.reset_index(level=0, inplace=True)
  x = df.loc[:,'index']
  current_date = datetime.today()
  filterDate = (current_date - pd.Timedelta(weeks=26)) - pd.Timedelta(days=1)

  for i in range(len(df.loc[:, 'index'])):
    df.loc[i,'index'] = datetime.strptime(df.loc[i,'index'] , '%Y-%m-%d')

  return df.loc[df['index'] > filterDate]

def trainInvestabilityIndexModel(){
  # Step 1: Pull 12 month data from load historical
  # Step 2: Get SPY+tickers return for that 6 month period, label if beat or not
  # Step 3: Call the analysis handler for train calcs + create dataframe
  # Step 4: Train the SVC on the dataframe w/ labels
  # Return trained model

}

def computeInvestabilityIndex(trainedModel){
  # Step 5: Run predict on each ticker with 6 calcs from db
  # Step 6: Output probability
  # Step 7: Truncate and write probability to the corresponding collection
  # Return status complete
}



