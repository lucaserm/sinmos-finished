import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NODE_APP_API_URL,
});
export default api;