
const URL_FILE_PATH = '/wss-url';
const fetchWssUrl = async () => {
    const response = await fetch(URL_FILE_PATH);
    return response.json();
};
const urlPromise = fetchWssUrl();
export const getWssUrl = async () => urlPromise;
