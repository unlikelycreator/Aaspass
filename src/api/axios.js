// src/api/axios.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://192.250.228.179:9088/api/v1",
});

export default api;