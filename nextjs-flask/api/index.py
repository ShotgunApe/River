import requests
from flask import Flask, request
app = Flask(__name__)

# API call to grab weather
@app.route("/api/get-weather", methods=['GET'])
def weather():
    lat = str(request.args.get('lat'))
    lon = str(request.args['lon'])
    return requests.get(f'https://api.weather.gov/points/{lat},{lon}').content
