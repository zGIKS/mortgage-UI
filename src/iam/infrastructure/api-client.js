const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

  async register(dni, email, password) {
    const response = await fetch(`${API_BASE_URL}/iam/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ dni, email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  },

  async updatePassword(token, password) {
    const response = await fetch(`${API_BASE_URL}/iam/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Password update failed');
    }

    return response.json();
  },
};
