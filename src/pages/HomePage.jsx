import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../iam/application/auth-service';
import { Card } from '../shared/components/Card';
import { Header } from '../shared/components/Header';
import { Sidebar } from '../shared/components/Sidebar';

export function HomePage() {
  const navigate = useNavigate();
  const { t } = useTranslation('shared');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <Header />

      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">{t('dashboard.welcome')}</h2>
          <p className="text-gray-400">{t('dashboard.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="hover:border-gray-700 transition-colors cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">{t('dashboard.cards.profile.title')}</h3>
                <p className="text-gray-400 text-sm">{t('dashboard.cards.profile.description')}</p>
              </div>
            </div>
          </Card>

          <Card
            className="hover:border-gray-700 transition-colors cursor-pointer"
            onClick={() => navigate('/mortgage/calculator')}
          >
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">{t('dashboard.cards.calculator.title')}</h3>
                <p className="text-gray-400 text-sm">{t('dashboard.cards.calculator.description')}</p>
              </div>
            </div>
          </Card>

          <Card
            className="hover:border-gray-700 transition-colors cursor-pointer"
            onClick={() => navigate('/mortgage/history')}
          >
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">{t('dashboard.cards.history.title')}</h3>
                <p className="text-gray-400 text-sm">{t('dashboard.cards.history.description')}</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
