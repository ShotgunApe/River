import requests
from flask import Flask
app = Flask(__name__)

# API call to grab weather
@app.route("/api/grab-coords", methods=['POST'])
def other():
    return requests.get('https://api.weather.gov/points/39.7456,-97.0892').content


# API call to grab weather
@app.route("/api/get-weather", methods=['GET'])
def weather():
    return requests.get('https://api.weather.gov/points/39.7456,-97.0892').content
