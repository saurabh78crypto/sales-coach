import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const submitPitch = async (pitch) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/feedback`, { pitch });
        return response.data;
    } catch (error) {
        console.error('Error submitting pitch:', error);
        throw error;
    }
};