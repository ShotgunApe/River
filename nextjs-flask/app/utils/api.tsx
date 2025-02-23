export const getReq = async function (lat: string | number, lon: string | number) {
    if (lat && lon) {
        //Truncate anything beyond four decimal places for API
        var latTwo = lat.toString().match(/^-?\d+(?:\.\d{0,4})?/)![0]
        var lonTwo = lon.toString().match(/^-?\d+(?:\.\d{0,4})?/)![0]
        
        // API call #1 to get 
        fetch("/api/get-weather?lat=" + latTwo + "&lon=" + lonTwo)
        .then(response => response.json())
        .then(data => {

            type trenches = {
                PRECIPITATION: number,
                MAX_TEMP: number,
                MIN_TEMP: number,
                AVG_WIND_SPEED: number,
                YEAR: number,
                TEMP_RANGE: number,
                WIND_TEMP_RATIO: number,
                MONTH: number,
                LAGGED_PRECIPITATION: number,
                LAGGED_AVG_WIND_SPEED: number,
                DAY_OF_YEAR: number,
                Fall: number,
                Spring: number,
                Summer: number,
                Winter: number
            }

            // API Call #2 to get weather data
            let forecastAPI = data["properties"]["forecast"]
            fetch(String(forecastAPI))
            .then(response => response.json())  
            .then(data => {
                let rain = data["properties"]["periods"][0]["probabilityOfPrecipitation"]["value"]
                let avgSpeed = data["properties"]["periods"][0]["windSpeed"].slice(0,2)
                let year = data["properties"]["periods"][0]["startTime"].slice(0,4)
                let month = data["properties"]["periods"][0]["startTime"].slice(5,7)
                let day = data["properties"]["periods"][0]["startTime"].slice(8,10)

                let spring = 0
                let summer = 0
                let fall = 0
                let winter = 0

                let minTemp = 0
                let maxTemp = 0

                if (month >= 3 && month <= 5) {
                    spring = 1
                } else if (month >= 6 && month <= 8) {
                    summer = 1
                } else if (month >= 9 && month <= 11) {
                    fall = 1
                } else if (month === 12 || month <= 2) {
                    winter = 1
                }

                // Check if data collection from weather api starts at night or day
                if (data["properties"]["periods"][0]["startTime"].slice(11,13) == 18) {
                    minTemp = data["properties"]["periods"][0]["temperature"];
                    maxTemp = data["properties"]["periods"][1]["temperature"];
                } else {
                    minTemp = data["properties"]["periods"][1]["temperature"];
                    maxTemp = data["properties"]["periods"][0]["temperature"];
                }

                // this should NEVER be negative, but I would rather play it safe than sorry
                let tempRange = Math.abs(maxTemp - minTemp)

                let winTempRatio = (avgSpeed / maxTemp);

                let toSend: trenches = {
                    "PRECIPITATION": (rain/100),
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
                
                postReq(toSend)
            });
        })
    }
};

export const postReq = async function (data: any) {
    try {
        console.log({ features: Object.values(data) })
        const response = await fetch("/api/predict", {
            method: "POST",
            body: JSON.stringify({ features: Object.values(data) }), // Convert object to array
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log(responseData);
    } catch (error) {
        console.error("Error:", error);
    }
};