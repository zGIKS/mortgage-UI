import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { authService } from '../../application/auth-service';
import { LanguageToggle } from '../../../shared/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('iam');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register(formData.email, formData.password, formData.full_name);
      toast.success(t('auth.success.accountCreated'));
      navigate('/login');
    } catch (err) {
      toast.error(err.message || t('auth.errors.registerFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="absolute right-6 top-6">
        <LanguageToggle />
      </div>

      <Card className="w-full max-w-md border-border/70 bg-card/95">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl">{t('auth.register.title')}</CardTitle>
          <CardDescription>{t('auth.register.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="register-name">{t('auth.register.firstName')}</Label>
              <Input
                id="register-name"
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder={t('auth.register.firstName')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email">{t('auth.register.email')}</Label>
              <Input
                id="register-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('auth.register.email')}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">{t('auth.register.password')}</Label>
              <Input
                id="register-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('auth.register.password')}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? t('shared:common.loading') : t('auth.register.submit')}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              {t('auth.register.hasAccount')}{' '}
              <Link to="/login" className="font-medium text-primary hover:underline">
                {t('auth.register.signIn')}
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
