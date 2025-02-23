export const getReq = async function (lat: string | number, lon: string | number) {
    if (lat && lon) {
        var latTwo = lat.toString().match(/^-?\d+(?:\.\d{0,4})?/)![0]
        var lonTwo = lon.toString().match(/^-?\d+(?:\.\d{0,4})?/)![0]
        
        const response = await fetch("https://river-be.onrender.com/api/get-weather?lat=" + latTwo + "&lon=" + lonTwo)
        const data = await response.json();

        let forecastAPI = data["properties"]["forecast"];
        const forecastResponse = await fetch(String(forecastAPI));
        const forecastData = await forecastResponse.json();

        let rain = forecastData["properties"]["periods"][0]["probabilityOfPrecipitation"]["value"];
        let avgSpeed = forecastData["properties"]["periods"][0]["windSpeed"].slice(0, 2);
        let year = forecastData["properties"]["periods"][0]["startTime"].slice(0, 4);
        let month = forecastData["properties"]["periods"][0]["startTime"].slice(5, 7);
        let day = forecastData["properties"]["periods"][0]["startTime"].slice(8, 10);

        let spring = 0, summer = 0, fall = 0, winter = 0;
        let minTemp = 0, maxTemp = 0;

        if (month >= 3 && month <= 5) spring = 1;
        else if (month >= 6 && month <= 8) summer = 1;
        else if (month >= 9 && month <= 11) fall = 1;
        else if (month === 12 || month <= 2) winter = 1;

        if (forecastData["properties"]["periods"][0]["startTime"].slice(11, 13) === '18') {
            minTemp = forecastData["properties"]["periods"][0]["temperature"];
            maxTemp = forecastData["properties"]["periods"][1]["temperature"];
        } else {
            minTemp = forecastData["properties"]["periods"][1]["temperature"];
            maxTemp = forecastData["properties"]["periods"][0]["temperature"];
        }

        let tempRange = Math.abs(maxTemp - minTemp);
        let winTempRatio = (avgSpeed / maxTemp);

        let toSend = {
            "PRECIPITATION": (rain / 100),
            "MAX_TEMP": maxTemp,
            "MIN_TEMP": minTemp,
            "AVG_WIND_SPEED": avgSpeed,
            "YEAR": year,
            "TEMP_RANGE": tempRange,
            "WIND_TEMP_RATIO": winTempRatio,
            "MONTH": month,
            "LAGGED_PRECIPITATION": 0.5,
            "LAGGED_AVG_WIND_SPEED": 6,
            "DAY_OF_YEAR": day,
            "Fall": fall,
            "Spring": spring,
            "Summer": summer,
            "Winter": winter
        };

        // Return the response from postReq
        return await postReq(toSend);
    }
};

export const postReq = async function (data: any) {
    try {
        const response = await fetch("https://river-be.onrender.com/api/predict", {
            method: "POST",
            body: JSON.stringify({ features: Object.values(data) }), // Convert object to array
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        return responseData
    } catch (error) {
        console.error("Error:", error);
    }
};