import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 8000,
});

// Adjunta el token JWT en cada petición si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ga_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el token expira o es inválido, limpia la sesión
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ga_token');
      localStorage.removeItem('ga_user');
    }
    return Promise.reject(err);
  }
);

export const checkHealth = () => api.get('/health');

// ── Auth ──
export const loginUser    = (email, password)                 => api.post('/auth/login',    { email, password });
export const registerUser = (nombre, email, password)         => api.post('/auth/register',  { nombre, email, password });

export default api;
