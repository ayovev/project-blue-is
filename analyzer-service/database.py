import os

DATABASE_URI = None

if os.getenv("PYTHON_ENV") == "production":
  PREFIX = "mongodb+srv"
  USERNAME = os.getenv("DATABASE_USERNAME")
  PASSWORD = os.getenv("DATABASE_PASSWORD")
  HOST = os.getenv("DATABASE_HOST")
  NAME = os.getenv("DATABASE_NAME")
  PARAMETERS = "retryWrites=true"

  DATABASE_URI = "{}://{}:{}@{}/{}?{}".format(PREFIX, USERNAME, PASSWORD, HOST, NAME, PARAMETERS)
else:
  PREFIX = "mongodb"
  HOST = "mongo"
  PORT = 27017
  NAME = "ieen"

  DATABASE_URI = "{}://{}:{}/{}".format(PREFIX, HOST, PORT, NAME)
