import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function UserInfoCard({ profile, email }) {
  const { t } = useTranslation('iam');

  return (
    <Card className="border-border/70 bg-card/90">
      <CardHeader>
        <CardTitle>{t('profile.userInfo.title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <p className="text-muted-foreground">{t('profile.userInfo.fullName')}</p>
          <p className="text-base font-medium text-foreground">{profile.full_name || '—'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t('profile.userInfo.email')}</p>
          <p className="text-base font-medium text-foreground">{email}</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t('profile.userInfo.dni')}</p>
          <p className="text-base font-medium text-foreground">{profile.dni || '—'}</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">{t('profile.userInfo.firstName')}</p>
            <p className="text-base font-medium text-foreground">{profile.first_name || '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('profile.userInfo.firstLastName')}</p>
            <p className="text-base font-medium text-foreground">{profile.first_last_name || '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('profile.userInfo.secondLastName')}</p>
            <p className="text-base font-medium text-foreground">{profile.second_last_name || '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('profile.userInfo.currency')}</p>
            <p className="text-base font-medium text-foreground">{profile.currency || '—'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">{t('profile.userInfo.phoneNumber')}</p>
            <p className="text-base font-medium text-foreground">{profile.phone_number || '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('profile.userInfo.monthlyIncome')}</p>
            <p className="text-base font-medium text-foreground">
              {profile.monthly_income ?? '—'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-muted-foreground">{t('profile.userInfo.maritalStatus')}</p>
            <p className="text-base font-medium text-foreground">
              {profile.marital_status || '—'}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">{t('profile.userInfo.accountCreated')}</p>
            <p className="text-base font-medium text-foreground">
              {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-md border border-border/60 bg-muted/40 px-3 py-2">
            <span className="text-muted-foreground text-sm">{t('profile.userInfo.isFirstHome')}</span>
            <span className="text-base font-medium text-foreground">
              {profile.is_first_home ? t('shared:common.yes') : t('shared:common.no')}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-md border border-border/60 bg-muted/40 px-3 py-2">
            <span className="text-muted-foreground text-sm">{t('profile.userInfo.hasOwnLand')}</span>
            <span className="text-base font-medium text-foreground">
              {profile.has_own_land ? t('shared:common.yes') : t('shared:common.no')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}