import axios from "axios";

const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const createReview = (data) => {
    return axios.post(`${API_BASE}/api/review/create`, data);
};

export const getReviews = () => {
    return axios.get(`${API_BASE}/api/review/get`);
};