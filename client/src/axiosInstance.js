import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, //! http://localhost:3000/api
});

let accessToken = '';

function setAccessToken(newToken) {
  accessToken = newToken;
}

//! interceptor - перехватчик

axiosInstance.interceptors.request.use((config) => {
  config.withCredentials = true;
  if (!config.headers.Authorization) {
    config.headers.Authorization = `Project ${accessToken}`;
  }
  return config;
});

export { setAccessToken };

export default axiosInstance;
