import axios from 'axios';
import { BASE_URL } from '../constants';

export const Axios = axios.create({
    baseURL: BASE_URL,
});

export const setTokenAxios = (token: string) => {
    Axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
};
