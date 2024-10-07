
const API_KEY = process.env.MAP_TOKEN; 
const BASE_URL = 'https://geocode.search.hereapi.com/v1/geocode';

const forwardGeocode = async (address) => {
    const { default: fetch } = await import('node-fetch');

    const url = `${BASE_URL}?q=${encodeURIComponent(address)}&apiKey=${API_KEY}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
};
module.exports =  forwardGeocode; 