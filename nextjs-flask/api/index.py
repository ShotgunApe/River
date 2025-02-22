import requests
from flask import Flask
app = Flask(__name__)

@app.route("/api/get_weather", methods=['GET'])
def weather():
    return requests.get('https://api.weather.gov/points/39.7456,-97.0892').content
