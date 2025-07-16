import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Update to your deployed server
});

// Add token to all requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const createGig = (data) => API.post('/gigs', data);
export const getGigs = () => API.get('/gigs');
export const getGigById = (id) => API.get(`/gigs/${id}`);
