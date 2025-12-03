import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { authService } from '../../application/auth-service';
import { LanguageToggle } from '../../../shared/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('iam');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
      await authService.login(formData.email, formData.password);
      toast.success(t('auth.success.loginSuccess'));
      navigate('/home');
    } catch (err) {
      toast.error(err.message || t('auth.errors.loginFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="absolute right-6 top-6">
        <LanguageToggle />
      </div>

      <TooltipProvider delayDuration={100}>
        <Card className="w-full max-w-md border-border/70 bg-card/95">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl">{t('auth.login.title')}</CardTitle>
            <CardDescription>{t('auth.login.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="login-email">{t('auth.login.email')}</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <HelpCircle className="h-4 w-4" />
                        <span className="sr-only">{t('auth.tooltips.email')}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {t('auth.tooltips.email')}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t('auth.login.email')}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="login-password">{t('auth.login.password')}</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <HelpCircle className="h-4 w-4" />
                        <span className="sr-only">{t('auth.tooltips.password')}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {t('auth.tooltips.password')}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t('auth.login.password')}
                  required
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t('shared:common.loading') : t('auth.login.submit')}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                {t('auth.login.noAccount')}{' '}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  {t('auth.login.createAccount')}
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>
      </TooltipProvider>
    </div>
  );
}
