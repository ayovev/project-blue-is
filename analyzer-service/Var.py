import math

from DBInterface import DBInterface

class Var:
  '''Value at Risk for single security'''

  ticker = "XYZ"
  client, collection = DBInterface.connect() #need try catch here

  @staticmethod
  def setTicker(newTicker):
    Var.ticker = newTicker
    return True

  @staticmethod
  def loadHistorical():
    return True

  @staticmethod
  def test():
    return str(Var.client)
