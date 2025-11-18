import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mortgageService } from '../api/mortgageService';
import { Header } from '../../shared/components/Header';
import { Sidebar } from '../../shared/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const MortgageHistoryPage = () => {
  const { t } = useTranslation('mortgage');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatPercentage = (value) => (value * 100).toFixed(4);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await mortgageService.getMortgageHistory(50, 0);
      setHistory(data);
    } catch (err) {
      setError(err?.message || t('history.messages.loadingError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('history.confirmDelete'))) {
      return;
    }

    try {
      await mortgageService.deleteMortgage(id);
      fetchHistory();
    } catch (err) {
      alert(t('history.messages.deleteFailed') + ': ' + (err?.message || 'Unknown error'));
    }
  };

  const handleView = (id) => {
    navigate(`/mortgage/${id}`);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <span className="text-muted-foreground">{t('shared:common.loading')}</span>
        </div>
      );
    }

    if (error) {
      return (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      );
    }

    if (history.length === 0) {
      return (
        <Card className="border-dashed border-border/60 bg-card/50 text-center">
          <CardContent className="py-12">
            <p className="text-muted-foreground">{t('history.empty')}</p>
            <Button className="mt-4" onClick={() => navigate('/mortgage/calculator')}>
              {t('history.emptySubtitle')}
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-6">
        {history.map((item) => (
          <Card key={item.id} className="border-border/70 bg-card/90">
            <CardHeader className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>{t('history.card.calculationNumber', { number: item.id })}</CardTitle>
                <p className="text-sm text-muted-foreground">{formatDate(item.created_at)}</p>
              </div>
              <Badge variant="secondary" className="w-fit">
                {item.currency}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-muted-foreground">{t('history.card.propertyPrice')}</p>
                  <p className="font-semibold text-foreground">
                    {item.currency} {formatCurrency(item.property_price)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('history.card.loanAmount')}</p>
                  <p className="font-semibold text-foreground">
                    {item.currency} {formatCurrency(item.loan_amount)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('history.card.fixedInstallment')}</p>
                  <p className="font-semibold text-foreground">
                    {item.currency} {formatCurrency(item.fixed_installment)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('history.card.term')}</p>
                  <p className="font-semibold text-foreground">
                    {t('history.card.termMonths', { months: item.term_months })}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('history.card.tcea')}</p>
                  <p className="font-semibold text-foreground">
                    {formatPercentage(item.tcea)}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('history.card.created')}</p>
                  <p className="font-semibold text-foreground">{formatDate(item.created_at)}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={() => handleView(item.id)}>
                  {t('history.actions.view')}
                </Button>
                <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                  {t('history.actions.delete')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />

      <main className="lg:ml-72 px-4 sm:px-6 lg:px-10 py-10 space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{t('history.subtitle')}</p>
            <h1 className="text-3xl font-semibold text-foreground">{t('history.title')}</h1>
          </div>
          <Button onClick={() => navigate('/mortgage/calculator')}>
            {t('history.createNew')}
          </Button>
        </div>

        {renderContent()}
      </main>
    </div>
  );
};

export default MortgageHistoryPage;
