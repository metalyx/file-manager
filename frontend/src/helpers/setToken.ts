import { setTokenAxios } from './Axios';

export const setToken = (token: string) => {
    window.localStorage.setItem('token', token);
    setTokenAxios(token);
};
