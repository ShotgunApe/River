export const getReq = function (lat: string | number, lon: string | number) : any {
    if (lat && lon) {
        var latTwo = lat.toString().match(/^-?\d+(?:\.\d{0,4})?/)![0]
        var lonTwo = lon.toString().match(/^-?\d+(?:\.\d{0,4})?/)![0]
        fetch("/api/get-weather?lat=" + latTwo + "&lon=" + lonTwo)
        .then(response => {
            return response
        })  
    }
};

export const getPredict = (prediction: string) => {

    //let obj = JSON.parse(JSON.stringify(prediction));
    const u = new URLSearchParams(prediction).toString();
    fetch("/api/predict?data=" + prediction)
    .then(response => response.json())  
    .then(json => {
        console.log(json);
    })
}