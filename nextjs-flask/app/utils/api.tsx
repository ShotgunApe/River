export const getReq = () => {
    fetch("/api/get-weather")
    .then(response => response.json())  
    .then(json => {
        console.log(json);
    })
};

export const postReq = () => {
    fetch("/api/more-info")
    .then(response => response.json())  
    .then(json => {
        console.log(json);
    })
};