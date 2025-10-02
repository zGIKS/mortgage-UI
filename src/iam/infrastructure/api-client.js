const API_BASE_URL = 'http://localhost:8080/api/v1';

export const apiClient = {
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/iam/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    return response.json();
  },

  async register(email, password, full_name) {
    const response = await fetch(`${API_BASE_URL}/iam/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, full_name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  async updateProfile(token, email, password) {
    const body = {};
    if (email) body.email = email;
    if (password) body.password = password;

    const response = await fetch(`${API_BASE_URL}/iam/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Profile update failed');
    }

    return response.json();
  },
};
