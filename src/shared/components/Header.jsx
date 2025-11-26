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
    <header className="sticky top-0 z-40 border-b border-border bg-card backdrop-blur lg:left-72 lg:w-[calc(100%-18rem)]">
      <div className="px-4 sm:px-6 lg:px-10">
        <div className="flex min-h-16 flex-col gap-3 py-3 pl-16 sm:h-16 sm:flex-row sm:items-center sm:justify-between lg:pl-0">
          <div className="flex items-center gap-3">
            <p className="min-w-0 text-lg font-semibold tracking-tight text-foreground truncate">
            {t('header.hello', { name: user?.full_name })}
          </p>
          </div>
          <div className="flex w-full flex-wrap items-center gap-3 sm:w-auto sm:flex-nowrap sm:justify-end">
            <LanguageToggle />
            <Button
              variant="outline"
              className="h-10 gap-2 border-border/70 bg-background/80 w-full sm:w-auto"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" aria-hidden />
              {t('header.logout')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
