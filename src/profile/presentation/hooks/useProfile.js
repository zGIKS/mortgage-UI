import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { profileService } from '../../application/profile-service';
import { authService } from '../../../iam/application/auth-service';

export function useProfile() {
  const navigate = useNavigate();
  const { t } = useTranslation('iam');
  const [email, setEmail] = useState('');
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState('');
  const [formData, setFormData] = useState({
    phone_number: '',
    monthly_income: '',
    currency: 'PEN',
    marital_status: '',
    is_first_home: false,
    has_own_land: false,
  });
  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const token = authService.getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    const currentUser = authService.getUser();
    if (currentUser?.email) {
      setEmail(currentUser.email);
    }

    profileService
      .getProfile()
      .then((data) => {
        setProfile(data);
        setProfileError('');
        setFormData({
          phone_number: data.phone_number ?? '',
          monthly_income:
            data.monthly_income === null || data.monthly_income === undefined
              ? ''
              : String(data.monthly_income),
          currency: data.currency || 'PEN',
          marital_status: data.marital_status || '',
          is_first_home: Boolean(data.is_first_home),
          has_own_land: Boolean(data.has_own_land),
        });
        if (!currentUser?.email && data.email) {
          setEmail(data.email);
        }
      })
      .catch((err) => {
        toast.error(err.message || t('profile.messages.updateFailed'));
        if (err.status === 401) {
          authService.logout();
          navigate('/login');
        }
        setProfileError(err.message || t('profile.messages.updateFailed'));
      })
      .finally(() => setLoadingProfile(false));
  }, [navigate, t]);

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        currency: formData.currency,
        has_own_land: formData.has_own_land,
        is_first_home: formData.is_first_home,
        marital_status: formData.marital_status,
        monthly_income:
          formData.monthly_income === '' ? 0 : Number(formData.monthly_income),
        phone_number: formData.phone_number,
      };

      const updatedProfile = await profileService.updateProfile(payload);
      setProfile(updatedProfile);
      toast.success(t('profile.messages.updateSuccess'));
      setFormData({
        phone_number: updatedProfile.phone_number ?? '',
        monthly_income:
          updatedProfile.monthly_income === null || updatedProfile.monthly_income === undefined
            ? ''
            : String(updatedProfile.monthly_income),
        currency: updatedProfile.currency || 'PEN',
        marital_status: updatedProfile.marital_status || '',
        is_first_home: Boolean(updatedProfile.is_first_home),
        has_own_land: Boolean(updatedProfile.has_own_land),
      });
    } catch (err) {
      toast.error(err.message || t('profile.messages.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    profile,
    profileError,
    formData: { ...formData, email },
    loading,
    loadingProfile,
    handleFormChange,
    handleSelectChange,
    handleSubmit,
  };
}