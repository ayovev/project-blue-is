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

def trainInvestabilityIndexModel(){
  # Step 1:
  # Step 2:
  # Step 3:
  # Step 4:
  #return trained model

}

def computeInvestabilityIndex(trainedModel){
  # Step 5:
  # Step 6:
  # Step 7: Truncated and write probability to the corresponding collection
  # return status complete
}



