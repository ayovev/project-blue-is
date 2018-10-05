"""datetime module used in status route handler"""
from datetime import datetime, timezone, timedelta
from flask import Flask, jsonify

app = Flask("analyzer-service")
app.config["ENV"] = "development"
app.config["DEBUG"] = 1

@app.route("/")
def rootHandler():
  """Documentation for root route handler"""
  return "Flask root route"

@app.route("/users")
def usersHandler():
  """Documentation for users route handler"""
  return "Flask users route"

@app.route("/status")
def statusHandler():
  """Documentation for status route handler"""
  timezoneOffset = timezone(offset=timedelta(hours=-7))
  return jsonify({
    "datetime": datetime.now(tz=timezoneOffset).strftime("%Y-%m-%d %H:%M:%S"),
    "service": "analyzer-service",
    "status": 200
  })

if __name__ == "__main__":
  app.run(host="0.0.0.0", port=4000)
