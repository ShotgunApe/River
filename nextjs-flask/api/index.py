import requests
from flask import Flask, request
import os
import joblib
import pandas as pd

app = Flask(__name__)

# API call to grab weather
@app.route("/api/get-weather", methods=['GET'])
def weather():
    lat = str(request.args.get('lat'))
    lon = str(request.args.get('lon'))
    response = requests.get(f'https://api.weather.gov/points/{lat},{lon}')
    data = response.json()
    return data

@app.route("/api/get-weather", methods=['GET'])
def weather():
    lat = str(request.args.get('lat'))
    lon = str(request.args.get('lon'))
    response = requests.get(f'https://api.weather.gov/points/{lat},{lon}')
    data = response.json()
    return data


# Load the trained model

file_path = os.path.join(os.path.dirname(__file__), "rf_model.pkl")
model = joblib.load(file_path)

 
# Feature names (same as used during training)
feature_names = [
    "PRECIPITATION", "MAX_TEMP", "MIN_TEMP", "AVG_WIND_SPEED", "YEAR",
    "TEMP_RANGE", "WIND_TEMP_RATIO", "MONTH", "LAGGED_PRECIPITATION",
    "LAGGED_AVG_WIND_SPEED", "DAY_OF_YEAR", "Fall", "Spring", "Summer", "Winter"
]

@app.route("/api/predict", methods=['GET'])
def predict():
    data = {
    "features": [0.0, 69.0, 58.0, 6.49, 1989, 11.0, 0.094058, 4, 0.00, 7.285714, 250, 1.0, 0.0, 0.0, 0.0]
    }
    try:
        # Convert input data to DataFrame
        X_test = pd.DataFrame([data["features"]], columns=feature_names)
        # Get probability of True (class 1)
        probability = model.predict_proba(X_test)[0][1]
        return {"prediction_probability": probability}
    except Exception as e:
        return {"error": str(e)}
