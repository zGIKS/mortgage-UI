import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { mortgageService } from '../api/mortgageService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import MortgagePageLayout from '../components/layout/MortgagePageLayout';
import MortgageHistoryCard from '../components/history/MortgageHistoryCard';
import { useFinancialFormatters } from '../hooks/useFinancialFormatters';

const MortgageHistoryPage = () => {
  const { t } = useTranslation('mortgage');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mortgageToDelete, setMortgageToDelete] = useState(null);
  const navigate = useNavigate();
  const { formatCurrency, formatPercentageString, formatDate } = useFinancialFormatters();

  const fetchHistory = useCallback(async () => {
    setLoading(true);

    try {
      const data = await mortgageService.getMortgageHistory(50, 0);
      setHistory(data);
    } catch (err) {
      toast.error(err?.message || t('pages.history.messages.loadingError'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const handleDelete = (id) => {
    setMortgageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!mortgageToDelete) return;

    try {
      await mortgageService.deleteMortgage(mortgageToDelete);
      toast.success(t('pages.history.messages.deleteSuccess'));
      fetchHistory();
      setDeleteDialogOpen(false);
      setMortgageToDelete(null);
    } catch (err) {
      toast.error(err?.message || t('pages.history.messages.deleteFailed'));
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

    if (history.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-muted-foreground">{t('pages.history.empty')}</p>
            <Button variant="default" onClick={() => navigate('/mortgage/calculator')}>
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
            currency={item.moneda}
            fields={[
              {
                label: t('pages.history.card.propertyPrice'),
                value: formatCurrency(item.precio_venta, item.moneda),
              },
              {
                label: t('pages.history.card.loanAmount'),
                value: formatCurrency(item.monto_prestamo, item.moneda),
              },
              {
                label: t('pages.history.card.fixedInstallment'),
                value: formatCurrency(item.cuota_fija, item.moneda),
              },
              {
                label: t('pages.history.card.term'),
                value: t('pages.history.card.termMonths', { months: item.plazo_meses }),
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
                variant: 'default',
                onClick: () => handleView(item.id),
              },
              {
                label: t('pages.history.actions.delete'),
                variant: 'destructive',
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
        <Button variant="default" onClick={() => navigate('/mortgage/calculator')}>{t('pages.history.createNew')}</Button>
      }
    >
      {renderContent()}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('pages.history.confirmDeleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('pages.history.confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMortgageToDelete(null)}>
              {t('shared:common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {t('pages.history.actions.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MortgagePageLayout>
  );
};

export default MortgageHistoryPage;
