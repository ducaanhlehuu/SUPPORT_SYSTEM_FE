// apiClient.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const fetchFood = async (time, type, calo, lat, long, minPrice, maxPrice) => {
    try {
      const url = `/food?time=${encodeURIComponent(time)}&type=${encodeURIComponent(type)}&calo=${encodeURIComponent(calo)}&lat=${encodeURIComponent(lat)}&long=${encodeURIComponent(long)}&min_price=${encodeURIComponent(minPrice)}&max_price=${encodeURIComponent(maxPrice)}`;
  
      const response = await apiClient.get(url);
  
      return response.data;
    } catch (error) {
      console.error('Error fetching food:', error);
      throw error;
    }
};

const fetchRestaurants = async () => {
  try {
    const response = await apiClient.get('/restaurants');
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

const fetchTypes = async () => {
  try {
    const response = await apiClient.get('/types');
    return response.data;
  } catch (error) {
    console.error('Error fetching types:', error);
    throw error;
  }
};

export { fetchFood, fetchRestaurants, fetchTypes };
