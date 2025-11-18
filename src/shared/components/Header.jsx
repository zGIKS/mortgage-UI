import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import { authService } from '../../iam/application/auth-service';
import { Button } from '@/components/ui/button';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation('shared');
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur lg:left-72 lg:w-[calc(100%-18rem)]">
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          <p className="text-lg font-semibold tracking-tight text-foreground">
            {t('header.hello', { name: user?.full_name })}
          </p>
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <Button variant="secondary" size="sm" className="gap-2" onClick={handleLogout}>
              <LogOut className="h-4 w-4" aria-hidden />
              {t('header.logout')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
