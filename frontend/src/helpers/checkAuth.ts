import axios from 'axios';
import { BASE_URL } from '../constants';

export const checkAuth = async () => {
    const token = window.localStorage.getItem('token');

    if (!token) {
        return false;
    }

    try {
        const response = await axios.get(`${BASE_URL}/auth/auth`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (e: any) {
        return false;
    }
};
