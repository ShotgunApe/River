export const getReq = async function (lat: string | number, lon: string | number) {
    if (lat && lon) {
        var latTwo = lat.toString().match(/^-?\d+(?:\.\d{0,4})?/)![0]
        var lonTwo = lon.toString().match(/^-?\d+(?:\.\d{0,4})?/)![0]
        var json = await fetch("/api/get-weather?lat=" + latTwo + "&lon=" + lonTwo)
        .then(response => {
            response.json();
        })
        return json;
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