// src/api/filterApi.js

import api from "./axios";

export const getFilterOptions = async (endpoint) => {
  try {
    const response = await api.get(`/${endpoint}`);

    return response.data;
  } catch (error) {
    console.error(`Filter API Error (${endpoint})`, error);

    return [];
  }
};