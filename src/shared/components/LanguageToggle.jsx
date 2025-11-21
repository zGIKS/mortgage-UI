import { useTranslation } from 'react-i18next';
import { ChevronsUpDown, Check } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

export function LanguageToggle() {
  const { t } = useTranslation('shared');
  const { currentLanguage, changeLanguage, availableLanguages } = useLanguage();
  const currentLang = availableLanguages.find((lang) => lang.code === currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-10 gap-2 border-border/70 bg-background/80"
          aria-label={t('header.language')}
        >
          <span className="text-lg leading-none">{currentLang?.flag}</span>
          <span className="hidden sm:inline text-sm">{currentLang?.name}</span>
          <ChevronsUpDown className="h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
        <DropdownMenuLabel className="text-xs text-muted-foreground uppercase tracking-wide">
          {t('header.language')}
        </DropdownMenuLabel>
        {availableLanguages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => changeLanguage(language.code)}
            className="flex items-center gap-3 text-sm"
          >
            <span className="text-xl leading-none">{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            {currentLanguage === language.code && (
              <Check className="h-4 w-4 text-primary" aria-hidden />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
