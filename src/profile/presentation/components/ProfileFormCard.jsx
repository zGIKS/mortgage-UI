import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ProfileFormCard({
  formData,
  loading,
  onChange,
  onSelectChange,
  onSubmit
}) {
  const { t } = useTranslation('iam');

  const sanitizeMonthlyIncome = (value) => {
    const raw = String(value ?? '');
    const endsWithSeparator = /[.,]$/.test(raw);
    const normalized = raw.replace(',', '.');
    const cleaned = normalized.replace(/[^\d.]/g, '').split('.');

    const integerPart = (cleaned[0] || '').slice(0, 10);
    const decimalPart = cleaned[1] ? cleaned[1].slice(0, 2) : '';

    if (endsWithSeparator && decimalPart === '') {
      if (integerPart) return `${integerPart}.`;
      return raw.trim() === '' ? '' : '.';
    }

    if (decimalPart && integerPart) return `${integerPart}.${decimalPart}`;
    if (decimalPart && !integerPart) return `0.${decimalPart}`;
    return integerPart;
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (name === 'phone_number') {
      const numericValue = value.replace(/\D/g, '').slice(0, 9);
      onChange(name, numericValue);
      return;
    }

    if (name === 'monthly_income') {
      const sanitized = sanitizeMonthlyIncome(value);
      onChange(name, sanitized);
      return;
    }

    onChange(name, type === 'checkbox' ? checked : value);
  };

  const handleSelectChange = (name) => (value) => {
    onSelectChange(name, value);
  };

  return (
    <Card className="border-border/70 bg-card/90">
      <CardHeader>
        <CardTitle>{t('profile.form.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">{t('profile.userInfo.email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-muted/60"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number">{t('profile.form.phoneNumber')}</Label>
            <Input
              id="phone_number"
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder={t('profile.form.phonePlaceholder')}
              inputMode="numeric"
              pattern="[0-9]{9}"
              maxLength={9}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthly_income">{t('profile.form.monthlyIncome')}</Label>
            <Input
              id="monthly_income"
              type="text"
              name="monthly_income"
              inputMode="decimal"
              pattern="^[0-9]{0,10}([\\.,][0-9]{0,2})?$"
              maxLength={14}
              value={formData.monthly_income}
              onChange={handleChange}
              placeholder={t('profile.form.monthlyIncomePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label>{t('profile.form.currency')}</Label>
            <Select
              value={formData.currency}
              onValueChange={handleSelectChange('currency')}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('profile.form.currency')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PEN">{t('profile.select.currency.pen')}</SelectItem>
                <SelectItem value="USD">{t('profile.select.currency.usd')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{t('profile.form.maritalStatus')}</Label>
            <Select
              value={formData.marital_status}
              onValueChange={handleSelectChange('marital_status')}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('profile.form.maritalStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SOLTERO">{t('profile.select.maritalStatus.soltero')}</SelectItem>
                <SelectItem value="CASADO">{t('profile.select.maritalStatus.casado')}</SelectItem>
                <SelectItem value="DIVORCIADO">{t('profile.select.maritalStatus.divorciado')}</SelectItem>
                <SelectItem value="VIUDO">{t('profile.select.maritalStatus.viudo')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-md border border-border/70 bg-muted/40 px-3 py-2">
              <input
                type="checkbox"
                name="is_first_home"
                checked={formData.is_first_home}
                onChange={handleChange}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-sm text-foreground">{t('profile.form.isFirstHome')}</span>
            </label>
            <label className="flex items-center gap-3 rounded-md border border-border/70 bg-muted/40 px-3 py-2">
              <input
                type="checkbox"
                name="has_own_land"
                checked={formData.has_own_land}
                onChange={handleChange}
                className="h-4 w-4 accent-primary"
              />
              <span className="text-sm text-foreground">{t('profile.form.hasOwnLand')}</span>
            </label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? t('profile.form.updating') : t('profile.form.submit')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
