const API_BASE_URL = 'https://api-manajemen-barang-hilang.vercel.app/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders = {};

    if (options.body && !(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

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

    console.log('Making request to:', url);
    console.log('Request config:', config);

    try {
      const response = await fetch(url, config);

      console.log('Response status:', response.status);

      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(responseText);
        } catch (e) {
          errorData = { message: responseText };
        }
        throw new Error(errorData.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      return JSON.parse(responseText);
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

  async getUserById(userId) {
    return await this.makeRequest(`/users/${userId}`, {
      method: 'GET',
    });
  }

  async createUser(userData) {
    console.log('Creating user with data:', userData);
    if (userData instanceof FormData) {
      return await this.makeRequest('/users', {
        method: 'POST',
        body: userData,
      });
    }

    if (!userData.email || !userData.password || !userData.username) {
      throw new Error('Email, password, dan username wajib diisi');
    }

    return await this.makeRequest('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return await this.makeRequest('/user/profile', {
      method: 'GET',
    });
  }

  // Pastikan fungsi deleteUser ada dan benar
  async deleteUser(userId) {
  console.log('API deleteUser called with ID:', userId); // Debug log
  
  if (!userId) {
    throw new Error('User ID is required');
  }

  console.log('Making DELETE request to:', `/users/${userId}`); // Debug log
  
  return await this.makeRequest(`/users/${userId}`, {
    method: 'DELETE',
  });
}



  async updateUser(userId, userData) {
    if (userData instanceof FormData) {
      console.log('Sending FormData:');
      for (let [key, value] of userData.entries()) {
        console.log(key, value);
      }

      return await this.makeRequest(`/users/${userId}`, {
        method: 'PUT',
        body: userData,
      });
    } else {
      return await this.makeRequest(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    }
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
