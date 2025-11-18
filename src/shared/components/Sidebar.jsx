import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, UserRound, Calculator, History, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { HouseIcon } from './icons/HouseIcon';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { path: '/home', icon: Home, labelKey: 'shared:common.home' },
  { path: '/profile', icon: UserRound, labelKey: 'shared:common.profile' },
  { path: '/mortgage/calculator', icon: Calculator, labelKey: 'shared:navigation.calculator' },
  { path: '/mortgage/history', icon: History, labelKey: 'shared:navigation.history' },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation('shared');

  const isActive = (path) => {
    if (location.pathname.match(/^\/mortgage\/\d+$/)) {
      return path === '/mortgage/history';
    }
    return location.pathname === path;
  };

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const navContent = (isMobile = false) => (
    <nav className="space-y-1">
      {NAV_ITEMS.map(({ path, labelKey, icon: Icon }) => {
        const active = isActive(path);
        return (
          <Button
            key={path}
            variant="ghost"
            className={cn(
              'w-full justify-start gap-3 text-sm font-medium',
              active ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
            )}
            onClick={() => (isMobile ? handleNavigate(path) : navigate(path))}
          >
            <Icon className="h-4 w-4" aria-hidden />
            <span>{t(labelKey)}</span>
          </Button>
        );
      })}
    </nav>
  );

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-40 lg:hidden"
            aria-label="Toggle navigation"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 border-r border-border/60 px-0">
          <div className="flex h-full flex-col">
            <div className="border-b border-border/60 px-6 py-6">
              <div className="flex items-center gap-3">
                <HouseIcon size={24} />
                <p className="text-base font-semibold text-foreground">{t('header.brand')}</p>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-6">{navContent(true)}</div>
          </div>
        </SheetContent>
      </Sheet>

      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:flex-col border-r border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="flex h-16 items-center border-b border-border/60 px-6">
          <div className="flex items-center gap-3">
            <HouseIcon size={20} />
            <p className="text-lg font-semibold text-foreground">{t('header.brand')}</p>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-6">{navContent()}</div>
      </aside>
    </>
  );
}
