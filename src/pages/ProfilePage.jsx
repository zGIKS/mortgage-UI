import { useTranslation } from 'react-i18next';
import { Header } from '../shared/components/Header';
import { Sidebar } from '../shared/components/Sidebar';
import { UserInfoCard } from '../profile/presentation/components/UserInfoCard';
import { ProfileFormCard } from '../profile/presentation/components/ProfileFormCard';
import { PasswordFormCard } from '../profile/presentation/components/PasswordFormCard';
import { useProfile } from '../profile/presentation/hooks/useProfile';

export function ProfilePage() {
  const { t } = useTranslation('iam');
  const {
    email,
    profile,
    profileError,
    formData,
    loading,
    loadingProfile,
    handleFormChange,
    handleSelectChange,
    handleSubmit,
  } = useProfile();

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <main className="lg:ml-72 px-4 sm:px-6 lg:px-10 py-10">
          <p className="text-muted-foreground">{t('shared:common.loading')}</p>
        </main>
      </div>
    );
  }

  if (!profile && profileError) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <main className="lg:ml-72 px-4 sm:px-6 lg:px-10 py-10">
          <p className="text-muted-foreground">{profileError}</p>
        </main>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />

      <main className="lg:ml-72 px-4 sm:px-6 lg:px-10 py-10 space-y-8">
        <h1 className="text-3xl font-semibold text-foreground">{t('profile.title')}</h1>

        <div className="grid gap-8 lg:grid-cols-2">
          <UserInfoCard profile={profile} email={email} />
          <ProfileFormCard
            formData={formData}
            loading={loading}
            onChange={handleFormChange}
            onSelectChange={handleSelectChange}
            onSubmit={handleSubmit}
          />
          <PasswordFormCard className="lg:col-span-2" />
        </div>
      </main>
    </div>
  );
}
