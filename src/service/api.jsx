const API_BASE_URL = 'https://api-manajemen-barang-hilang.vercel.app/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      defaultHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      headers: defaultHeaders,
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async login(email, password) {
    const response = await this.makeRequest('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.token) {
      this.token = response.token;
      localStorage.setItem('authToken', response.token);
    }

    return response;
  }

  async getUsers() {
    return await this.makeRequest('/users', {
      method: 'GET',
    });
  }

  async getCurrentUser() {
    return await this.makeRequest('/user/profile', {
      method: 'GET',
    });
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminUser');
  }

  isAuthenticated() {
    return !!this.token;
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }
}

export default new ApiService();
