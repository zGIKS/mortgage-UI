import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mortgageService } from '../api/mortgageService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MortgagePageLayout from '../components/layout/MortgagePageLayout';
import MortgageHistoryCard from '../components/history/MortgageHistoryCard';
import { useFinancialFormatters } from '../hooks/useFinancialFormatters';

const MortgageHistoryPage = () => {
  const { t } = useTranslation('mortgage');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { formatCurrency, formatPercentageString, formatDate } = useFinancialFormatters();

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await mortgageService.getMortgageHistory(50, 0);
      setHistory(data);
    } catch (err) {
      setError(err?.message || t('pages.history.messages.loadingError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const handleDelete = async (id) => {
    if (!window.confirm(t('pages.history.confirmDelete'))) {
      return;
    }

    try {
      await mortgageService.deleteMortgage(id);
      fetchHistory();
    } catch (err) {
      alert(t('pages.history.messages.deleteFailed') + ': ' + (err?.message || 'Unknown error'));
    }
  };

  const handleView = (id) => {
    navigate(`/mortgage/${id}`);
  };

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

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
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-muted-foreground">{t('pages.history.empty')}</p>
            <Button onClick={() => navigate('/mortgage/calculator')}>
              {t('pages.history.emptySubtitle')}
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid gap-6">
        {history.map((item) => (
          <MortgageHistoryCard
            key={item.id}
            title={t('pages.history.card.calculationNumber', { number: item.id })}
            subtitle={formatDate(item.created_at)}
            currency={item.currency}
            fields={[
              {
                label: t('pages.history.card.propertyPrice'),
                value: formatCurrency(item.property_price, item.currency),
              },
              {
                label: t('pages.history.card.loanAmount'),
                value: formatCurrency(item.loan_amount, item.currency),
              },
              {
                label: t('pages.history.card.fixedInstallment'),
                value: formatCurrency(item.fixed_installment, item.currency),
              },
              {
                label: t('pages.history.card.term'),
                value: t('pages.history.card.termMonths', { months: item.term_months }),
              },
              {
                label: t('pages.history.card.tcea'),
                value: formatPercentageString(item.tcea, { fromDecimal: true }),
              },
              {
                label: t('pages.history.card.created'),
                value: formatDate(item.created_at),
              },
            ]}
            actions={[
              {
                label: t('pages.history.actions.view'),
                variant: 'outline',
                onClick: () => handleView(item.id),
              },
              {
                label: t('pages.history.actions.delete'),
                variant: 'ghost',
                className: 'text-destructive hover:text-destructive',
                onClick: () => handleDelete(item.id),
              },
            ]}
          />
        ))}
      </div>
    );
  };

  return (
    <MortgagePageLayout
      title={t('pages.history.title')}
      subtitle={t('pages.history.subtitle')}
      actions={
        <Button onClick={() => navigate('/mortgage/calculator')}>{t('pages.history.createNew')}</Button>
      }
    >
      {renderContent()}
    </MortgagePageLayout>
  );
};

export default MortgageHistoryPage;
