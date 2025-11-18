import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../iam/application/auth-service';
import { Header } from '../shared/components/Header';
import { Sidebar } from '../shared/components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function ProfilePage() {
  const navigate = useNavigate();
  const { t } = useTranslation('iam');
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
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
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />

      <main className="lg:ml-72 px-4 sm:px-6 lg:px-10 py-10 space-y-8">
        <h1 className="text-3xl font-semibold text-foreground">{t('profile.title')}</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border-border/70 bg-card/90">
            <CardHeader>
              <CardTitle>{t('profile.userInfo.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">{t('profile.userInfo.fullName')}</p>
                <p className="text-base font-medium text-foreground">{user.full_name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('profile.userInfo.email')}</p>
                <p className="text-base font-medium text-foreground">{user.email}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t('profile.userInfo.accountCreated')}</p>
                <p className="text-base font-medium text-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90">
            <CardHeader>
              <CardTitle>{t('profile.updateProfile.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">{t('profile.updateProfile.email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('profile.updateProfile.emailPlaceholder')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">{t('profile.updateProfile.newPassword')}</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={t('profile.updateProfile.passwordPlaceholder')}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? t('shared:common.loading') : t('profile.updateProfile.submit')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
