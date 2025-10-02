import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../application/auth-service';
import { Input } from '../../../shared/components/Input';
import { Button } from '../../../shared/components/Button';
import { Card } from '../../../shared/components/Card';
import { LanguageToggle } from '../../../shared/components/LanguageToggle';

export function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('iam');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await authService.login(formData.email, formData.password);
      navigate('/home');
    } catch (err) {
      setError(err.message || t('auth.errors.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>
      
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('auth.login.title')}</h1>
          <p className="text-gray-400">{t('auth.login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('auth.login.email')}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={t('auth.login.email')}
            required
          />

          <Input
            label={t('auth.login.password')}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder={t('auth.login.password')}
            required
          />

          {error && (
            <div className="bg-red-900/20 border border-red-900 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t('shared:common.loading') : t('auth.login.submit')}
          </Button>

          <p className="text-center text-gray-400 text-sm">
            {t('auth.login.noAccount')}{' '}
            <Link to="/register" className="text-blue-500 hover:text-blue-400 font-medium">
              {t('auth.login.createAccount')}
            </Link>
          </p>
        </form>
      </Card>
    </div>
  );
}
