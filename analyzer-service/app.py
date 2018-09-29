from datetime import datetime
from flask import Flask, jsonify

app = Flask("analyzer-service")
app.config["ENV"] = "development"
app.config["DEBUG"] = 1


@app.route("/")
def main1():
    return "Flask root route"


@app.route("/users")
def main2():
    return "Flask users route"


@app.route("/status")
def status():
    return jsonify({
      "datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
      "service": "analyzer-service",
      "status": 200
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000)
