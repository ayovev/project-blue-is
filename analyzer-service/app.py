from datetime import datetime
from flask import Flask, jsonify

# import from local files
from DBInterface import DBInterface
from Seeder import Seeder

app = Flask("analyzer-service")
app.config["ENV"] = "development"
app.config["DEBUG"] = 1


@app.route("/")
def main1():
    return "Flask root route"

@app.route("/admin/getHistoricalData")
def historicalData():
    return DBInterface.getHistoricalData()

@app.route("/users")
def main2():
    return "Flask users route"

@app.route("/seed")
def main3():
    return Seeder.seed(["MU", "MSFT"])

@app.route("/seed/redeploy")
def redeploy():
    return Seeder.redeploy(["MU"])

@app.route("/seed/drop")
def drop():
    return Seeder.dropDB()


@app.route("/status")
def status():
    return jsonify({
      "datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
      "service": "analyzer-service",
      "status": 200
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000)
