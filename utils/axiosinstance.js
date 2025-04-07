import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:7979/dolibarr/htdocs/api/index.php', // URL de base pour toutes les requêtes
  headers: {
    'DOLAPIKEY': '8a8MsnQGo371to4oVLWk552rIhNUFIt8',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default axiosInstance;