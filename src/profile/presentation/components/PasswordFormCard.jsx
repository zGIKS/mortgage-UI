import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { authService } from '../../../iam/application/auth-service';

export function PasswordFormCard({ className = '' }) {
  const { t } = useTranslation('iam');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) {
      toast.error(t('profile.password.required'));
      return;
    }
    setLoading(true);
    try {
      await authService.updatePassword(password.trim());
      toast.success(t('profile.password.success'));
      setPassword('');
    } catch (err) {
      toast.error(err.message || t('profile.messages.updateFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className={`border-border/70 bg-card/90 ${className}`}>
      <CardHeader>
        <CardTitle>{t('profile.password.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new_password">{t('profile.password.newPassword')}</Label>
            <Input
              id="new_password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('profile.password.placeholder')}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            {t('profile.password.description')}
          </p>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? t('profile.password.updating') : t('profile.password.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
