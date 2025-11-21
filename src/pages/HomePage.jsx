import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserRound, Calculator, History } from 'lucide-react';
import { authService } from '../iam/application/auth-service';
import { Header } from '../shared/components/Header';
import { Sidebar } from '../shared/components/Sidebar';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const dashboardCards = (t) => [
  {
    title: t('dashboard.cards.profile.title'),
    description: t('dashboard.cards.profile.description'),
    icon: UserRound,
    href: '/profile',
    accent: 'text-primary bg-primary/10',
  },
  {
    title: t('dashboard.cards.calculator.title'),
    description: t('dashboard.cards.calculator.description'),
    icon: Calculator,
    href: '/mortgage/calculator',
    accent: 'text-secondary-foreground bg-secondary/20',
  },
  {
    title: t('dashboard.cards.history.title'),
    description: t('dashboard.cards.history.description'),
    icon: History,
    href: '/mortgage/history',
    accent: 'text-accent-foreground bg-accent/20',
  },
];

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

  const cards = dashboardCards(t);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />

      <main className="lg:ml-72 px-4 sm:px-6 lg:px-10 py-10">
        <section className="space-y-2">
          <p className="text-sm text-muted-foreground">{t('dashboard.subtitle')}</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {t('dashboard.welcome')}
          </h1>
        </section>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map(({ title, description, icon: Icon, href, accent }) => (
            <Card
              key={title}
              onClick={() => navigate(href)}
              className="group cursor-pointer border-border/70 bg-card/90 transition-all hover:border-primary/60 hover:shadow-lg"
            >
              <CardHeader className="space-y-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent}`}>
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <CardTitle className="text-xl">{title}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    {description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
