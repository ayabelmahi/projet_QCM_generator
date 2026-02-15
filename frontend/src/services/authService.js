import axios from 'axios';

const API_URL = 'http://localhost:8090/api';

export const registerUser = async (userData) => {
    // userData contiendra { fullName, email, password }
    return await axios.post(`${API_URL}/users`, userData, {
        headers: {
            'Content-Type': 'application/ld+json'
        }
    });
};