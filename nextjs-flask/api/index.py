import requests
from flask import Flask
app = Flask(__name__)

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/api/handle_get", methods=['GET'])
def process():
    testing = {
        'value1': '1',
        'value2': 'abcd'
    }
    return testing

@app.route("/api/get_weather", methods=['GET'])
def weather():
    return requests.get('https://api.weather.gov/points/39.7456,-97.0892').content
