export const getReq = (lat: string | number, lon: string | number) => {
    if (lat && lon) {
        var latTwo = lat.toString().match(/^-?\d+(?:\.\d{0,4})?/)![0]
        var lonTwo = lon.toString().match(/^-?\d+(?:\.\d{0,4})?/)![0]
        fetch("/api/get-weather?lat=" + latTwo + "&lon=" + lonTwo)
        .then(response => response.json())  
        .then(json => {
            console.log(json);
        })
    }
};

export const postReq = () => {
    fetch("/api/more-info")
    .then(response => response.json())  
    .then(json => {
        console.log(json);
    })
};

export const getPredict = () => {
    fetch("/api/predict")
    .then(response => response.json())  
    .then(json => {
        console.log(json);
    })
}