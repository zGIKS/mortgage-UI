const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const profileClient = {
  async getProfile(token) {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const error = new Error(errorBody.message || 'Failed to load profile');
      error.status = response.status;
      throw error;
    }

    return response.json();
  },

  async updateProfile(token, profileData) {
    const response = await fetch(`${API_BASE_URL}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const error = new Error(errorBody.message || 'Failed to update profile');
      error.status = response.status;
      throw error;
    }

    return response.json();
  },
};
