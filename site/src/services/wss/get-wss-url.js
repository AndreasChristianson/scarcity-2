const URL_FILE_PATH = '/wss-url';
const fetchWssUrl = async () => {
    const response = await fetch(URL_FILE_PATH);
    return response.json();
};

let urlPromise;

export const getWssUrl = () => {
    if(!urlPromise){
        urlPromise = fetchWssUrl();
    }
    return urlPromise;
}
