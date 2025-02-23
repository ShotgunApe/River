

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
                let toSend: trenches = {
                    "PRECIPITATION": rain,
                    "MAX_TEMP": 0,
                    "MIN_TEMP": 0,
                    "AVG_WIND_SPEED": 0,
                    "YEAR": 0,
                    "TEMP_RANGE": 0,
                    "WIND_TEMP_RATIO": 0,
                    "MONTH": 0,
                    "LAGGED_PRECIPITATION": 0,
                    "LAGGED_AVG_WIND_SPEED": 0,
                    "DAY_OF_YEAR": 0,
                    "Fall": 0,
                    "Spring": 0,
                    "Summer": 0,
                    "Winter": 0
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