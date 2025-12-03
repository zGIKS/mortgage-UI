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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

export function RegisterPage() {
  const navigate = useNavigate();
  const { t } = useTranslation('iam');
  const [formData, setFormData] = useState({
    dni: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'dni') {
      const numericValue = value.replace(/\D/g, '').slice(0, 8);
      setFormData({ ...formData, [name]: numericValue });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register(formData);
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

      <TooltipProvider delayDuration={100}>
        <Card className="w-full max-w-md border-border/70 bg-card/95">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl">{t('auth.register.title')}</CardTitle>
            <CardDescription>{t('auth.register.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="register-dni">{t('auth.register.dni')}</Label>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <HelpCircle className="h-4 w-4" />
                        <span className="sr-only">{t('auth.tooltips.dni')}</span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {t('auth.tooltips.dni')}
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="register-dni"
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  placeholder={t('auth.register.dni')}
                  inputMode="numeric"
                  pattern="[0-9]{8}"
                  maxLength={8}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="register-email">{t('auth.register.email')}</Label>
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
                <div className="flex items-center gap-2">
                  <Label htmlFor="register-password">{t('auth.register.password')}</Label>
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
      </TooltipProvider>
    </div>
  );
}
