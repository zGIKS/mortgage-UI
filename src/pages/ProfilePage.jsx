import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../iam/application/auth-service';
import { Input } from '../shared/components/Input';
import { Button } from '../shared/components/Button';
import { Card } from '../shared/components/Card';
import { Header } from '../shared/components/Header';
import { Sidebar } from '../shared/components/Sidebar';

export function ProfilePage() {
  const navigate = useNavigate();
  const { t } = useTranslation('iam');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = authService.getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setFormData({ email: currentUser.email, password: '' });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await authService.updateProfile(
        formData.email !== user.email ? formData.email : null,
        formData.password || null
      );
      setUser(updatedUser);
      setSuccess(t('profile.messages.updateSuccess'));
      setFormData({ ...formData, password: '' });
    } catch (err) {
      setError(err.message || t('profile.messages.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <Header />

      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">{t('profile.title')}</h1>

        <div className="grid gap-6 max-w-4xl">
          <Card>
            <h2 className="text-xl font-semibold text-white mb-6">{t('profile.userInfo.title')}</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-400">{t('profile.userInfo.fullName')}</span>
                <p className="text-gray-200 mt-1">{user.full_name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">{t('profile.userInfo.email')}</span>
                <p className="text-gray-200 mt-1">{user.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">{t('profile.userInfo.accountCreated')}</span>
                <p className="text-gray-200 mt-1">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-white mb-6">{t('profile.updateProfile.title')}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={t('profile.updateProfile.email')}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('profile.updateProfile.emailPlaceholder')}
              />

              <Input
                label={t('profile.updateProfile.newPassword')}
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('profile.updateProfile.passwordPlaceholder')}
              />

              {error && (
                <div className="bg-red-900/20 border border-red-900 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-900/20 border border-green-900 text-green-400 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              <Button type="submit" disabled={loading}>
                {loading ? t('profile.updateProfile.updating') : t('profile.updateProfile.submit')}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
