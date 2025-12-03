import { profileClient } from '../infrastructure/profile-client';
import { authService } from '../../iam/application/auth-service';

export const profileService = {
  async getProfile() {
    const token = authService.getToken();
    if (!token) throw new Error('No token found');
    return profileClient.getProfile(token);
  },

  async updateProfile(profileData) {
    const token = authService.getToken();
    if (!token) throw new Error('No token found');
    return profileClient.updateProfile(token, profileData);
  },
};
