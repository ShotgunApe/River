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
                weather: string
            }

            let params = data["properties"]

            const u = new URLSearchParams(params).toString();
            
            fetch("/api/predict?data=" + params)
            .then(response => response.json())  
            .then(json => {
                console.log(json);
            })
        })
    }
};