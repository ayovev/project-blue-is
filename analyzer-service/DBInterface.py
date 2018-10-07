import requests #native I think
import pymongo  #need to add to container

class DBInterface:
    '''class for opening, closing, getDailyData, and getHistData'''

    #class variables:
    tickers = ["MU", "AAPL", "CVX", "FB", "MSFT"]

    AV_KEY = "Z59MIQGN9I6S666Q" # .env
    username = "jschnebly" # .env
    password = "" #.env

    #methods

    @staticmethod
    def dbConnect():
        ''' Connect to mongo database and return a tuple with client and collection'''

        #host = "mongodb://"
        #URI = "@cluster0-shard-00-00-ialvl.mongodb.net:27017,cluster0-shard-00-01-ialvl.mongodb.net:27017,cluster0-shard-00-02-ialvl.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true"

        client = pymongo.MongoClient("mongodb://jschnebly:Wolfpack2019@cluster0-shard-00-00-ialvl.mongodb.net:27017,cluster0-shard-00-01-ialvl.mongodb.net:27017,cluster0-shard-00-02-ialvl.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true")
        db = client['pbi-data']
        collection = db.tickerData
        return (client, collection)


    @staticmethod
    def dbDisconnect(client):
        # Disconnect from MongoDB instance
        client.close()
        return 0


    @staticmethod
    def getHistoricalData():
        '''
        give string ticker
        get json of full historical data
        '''

        client, collection = DBInterface.dbConnect()

        for ticker in DBInterface.tickers:
            tickerJSON = requests.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={}&outputsize={}&apikey={}'.format(ticker, "full", DBInterface.AV_KEY))

            collection.insert({"data": tickerJSON.json()}, check_keys=False)
            print(ticker, "historical data has been inserted.")

        DBInterface.dbDisconnect(client)
        return "<h2>Historical data has been input into the cloud mongoDB instance!</h2>"

