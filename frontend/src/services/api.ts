import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const solveAssignment = async (file: File) => {
    const formData = new FormData();
    formData.append('assignmentFile', file);
    const response = await apiClient.post('/solve-assignment', formData);
    return response.data; // e.g., { jobId: "123" }
};

export const getJobStatus = async (jobId: string) => {
    const response = await apiClient.get(`/status/${jobId}`);
    return response.data;
};