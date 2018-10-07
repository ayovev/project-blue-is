import requests
from pymongo import MongoClient

class Seeder:
    '''Seeder -- static class'''

    # class variables
    AV_KEY = "Z59MIQGN9I6S666Q" # .env

    #methods

    @staticmethod
    def dropDB():
        client = MongoClient('localhost', 27017)
        client.drop_database('pbi')
        return "Successful drop of db: pbi"

    @staticmethod
    def seed(tickers):
        client = MongoClient('localhost', 27017)
        db = client.pbi
        collection = db.stocks

        for ticker in tickers:
            tickerJSON = requests.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={}&outputsize={}&apikey={}'.format(ticker, "compact", Seeder.AV_KEY))
            collection.insert({"data": tickerJSON.json()}, check_keys=False)

        client.close()
        return "Success seeding " + str(tickers)

    @staticmethod
    def redeploy(tickers):
        Seeder.dropDB()
        Seeder.seed(tickers)
        return "Successful redeployment on localhost with tickers " + str(tickers)
