export const getReq = () => {
    fetch("/api/get_weather")
    .then(response => response.json())  
    .then(json => {
        console.log(json);
    })
};