import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { mortgageService } from '../api/mortgageService';
import PaymentScheduleTable from '../components/PaymentScheduleTable';
import MortgageCalculatorForm from '../components/MortgageCalculatorForm';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
import MetricsGrid from '../components/common/MetricsGrid';
import KeyValueGrid from '../components/common/KeyValueGrid';
import { useFinancialFormatters } from '../hooks/useFinancialFormatters';

const MortgageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('mortgage');
  const [mortgage, setMortgage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { formatCurrency, formatPercentageString, formatDate } = useFinancialFormatters();

  const fetchMortgage = useCallback(async () => {
    setLoading(true);

    try {
      const data = await mortgageService.getMortgageById(id);
      setMortgage(data);
    } catch (err) {
      toast.error(err?.message || t('pages.details.messages.loadingError'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  const handleUpdate = async (formData) => {
    setUpdateLoading(true);

    try {
      const updatedData = await mortgageService.updateMortgage(id, formData);
      setMortgage(updatedData);
      setIsEditing(false);
      toast.success(t('pages.details.messages.updateSuccess'));
    } catch (err) {
      toast.error(err?.message || t('pages.details.messages.updateError'));
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await mortgageService.deleteMortgage(id);
      toast.success(t('pages.details.messages.deleteSuccess'));
      navigate('/mortgage/history');
    } catch (err) {
      toast.error(err?.message || t('pages.details.messages.deleteError'));
    }
  };

  useEffect(() => {
    fetchMortgage();
  }, [fetchMortgage]);

  if (loading) {
    return (
      <MortgagePageLayout header={null}>
        <div className="flex h-64 items-center justify-center">
          <span className="text-muted-foreground">{t('shared:common.loading')}</span>
        </div>
      </MortgagePageLayout>
    );
  }

  if (!mortgage) {
    return (
      <MortgagePageLayout header={null}>
        <div className="flex h-64 items-center justify-center">
          <Button variant="outline" onClick={() => navigate('/mortgage/history')}>
            {t('pages.details.backToHistory')}
          </Button>
        </div>
      </MortgagePageLayout>
    );
  }

  const metrics = [
    {
      label: t('pages.details.metrics.fixedInstallment'),
      value: formatCurrency(mortgage.cuota_fija, mortgage.moneda),
      accent: 'text-primary',
    },
    {
      label: t('pages.details.metrics.principalFinanced'),
      value: formatCurrency(mortgage.saldo_financiar, mortgage.moneda),
      accent: 'text-primary',
    },
    {
      label: t('pages.details.metrics.totalInterestPaid'),
      value: formatCurrency(mortgage.total_intereses, mortgage.moneda),
      accent: 'text-secondary',
    },
    {
      label: t('pages.details.metrics.totalPaid'),
      value: formatCurrency(mortgage.total_pagado, mortgage.moneda),
      accent: 'text-secondary',
    },
    {
      label: t('pages.details.metrics.tcea'),
      value: formatPercentageString(mortgage.tcea, { decimals: 6 }),
      accent: 'text-destructive',
    },
    {
      label: t('pages.details.metrics.periodicRate'),
      value: formatPercentageString(mortgage.tasa_periodo, { decimals: 6 }),
      accent: 'text-primary',
    },
    {
      label: t('pages.details.metrics.irr'),
      value: formatPercentageString(mortgage.tir, { decimals: 6 }),
      accent: 'text-primary',
    },
    mortgage.van !== 0 && {
      label: t('pages.details.metrics.npv'),
      value: formatCurrency(mortgage.van, mortgage.moneda),
      accent: 'text-secondary',
    },
    {
      label: t('pages.details.metrics.term'),
      value: t('pages.details.fields.termMonths', { months: mortgage.plazo_meses }),
      accent: 'text-muted-foreground',
    },
  ].filter(Boolean);

  const summaryDetails = [
    {
      label: t('pages.details.fields.bank'),
      value: mortgage.banco_nombre,
    },
    {
      label: t('pages.details.fields.propertyPrice'),
      value: formatCurrency(mortgage.precio_venta, mortgage.moneda),
    },
    {
      label: t('pages.details.fields.downPayment'),
      value: formatCurrency(mortgage.cuota_inicial, mortgage.moneda),
    },
    {
      label: t('pages.details.fields.loanAmount'),
      value: formatCurrency(mortgage.monto_prestamo, mortgage.moneda),
    },
    {
      label: t('pages.details.fields.bonusTechoPropio'),
      value: formatCurrency(mortgage.bono_techo_propio, mortgage.moneda),
    },
    {
      label: t('pages.details.fields.interestRate'),
      value: `${mortgage.tea}% (${mortgage.tipo_tasa})`,
    },
    {
      label: t('pages.details.fields.gracePeriod'),
      value:
        mortgage.tipo_gracia === 'NONE'
          ? t('pages.details.fields.gracePeriodNone')
          : t('pages.details.fields.gracePeriodValue', {
              months: mortgage.meses_gracia,
              type: mortgage.tipo_gracia,
            }),
    },
  ];

  const headerContent = (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/mortgage/history')}
          className="mb-2 gap-2"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('pages.details.back')}
        </Button>
        <h1 className="text-3xl font-semibold text-foreground">
          {t('pages.details.title', { id: mortgage.id })}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('pages.details.createdOn', { date: formatDate(mortgage.created_at) })}
        </p>
      </div>
      <div className="flex gap-2">
        {!isEditing ? (
          <>
            <Button variant="default" onClick={() => setIsEditing(true)}>
              {t('pages.details.edit')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t('pages.details.delete')}
            </Button>
          </>
        ) : (
          <Button
            variant="secondary"
            onClick={() => setIsEditing(false)}
          >
            {t('pages.details.cancel')}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <MortgagePageLayout header={headerContent}>
      {isEditing ? (
        <Card className="border-border/70 bg-card/90">
          <CardHeader>
            <CardTitle>{t('pages.details.editTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <MortgageCalculatorForm
              onCalculate={handleUpdate}
              loading={updateLoading}
              initialData={{
                banco_id: mortgage.banco_id,
                precio_venta: mortgage.precio_venta,
                cuota_inicial: mortgage.cuota_inicial,
                monto_prestamo: mortgage.monto_prestamo,
                bono_techo_propio: mortgage.bono_techo_propio,
                tea: mortgage.tea,
                plazo_meses: mortgage.plazo_meses,
                meses_gracia: mortgage.meses_gracia,
                tipo_gracia: mortgage.tipo_gracia,
                moneda: mortgage.moneda,
                tasa_descuento: mortgage.tasa_descuento || 0,
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-border/70 bg-card/90">
            <CardHeader>
              <CardTitle>{t('pages.details.summaryTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <MetricsGrid metrics={metrics} />
              <KeyValueGrid items={summaryDetails} />
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90">
            <CardHeader>
              <CardTitle>{t('pages.details.amortizationSchedule')}</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentScheduleTable schedule={mortgage.cronograma_pagos} />
            </CardContent>
          </Card>
        </>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('pages.details.confirmDeleteTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('pages.details.confirmDelete')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t('shared:common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {t('pages.details.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MortgagePageLayout>
  );
};

export default MortgageDetailPage;
