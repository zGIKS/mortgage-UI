import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { mortgageService } from '../api/mortgageService';
import PaymentScheduleTable from '../components/PaymentScheduleTable';
import MortgageCalculatorForm from '../components/MortgageCalculatorForm';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const { formatCurrency, formatPercentageString, formatDate } = useFinancialFormatters();

  const fetchMortgage = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await mortgageService.getMortgageById(id);
      setMortgage(data);
    } catch (err) {
      setError(err?.message || t('details.messages.loadingError'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  const handleUpdate = async (formData) => {
    setUpdateLoading(true);
    setError(null);

    try {
      const updatedData = await mortgageService.updateMortgage(id, formData);
      setMortgage(updatedData);
      setIsEditing(false);
    } catch (err) {
      setError(err?.message || t('details.messages.updateError'));
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t('details.confirmDelete'))) {
      return;
    }

    try {
      await mortgageService.deleteMortgage(id);
      navigate('/mortgage/history');
    } catch (err) {
      alert(t('details.messages.deleteError') + ': ' + (err?.message || 'Unknown error'));
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

  if (error && !mortgage) {
    return (
      <MortgagePageLayout header={null}>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate('/mortgage/history')}>
          {t('details.backToHistory')}
        </Button>
      </MortgagePageLayout>
    );
  }

  if (!mortgage) {
    return null;
  }

  const metrics = [
    {
      label: t('details.metrics.fixedInstallment'),
      value: formatCurrency(mortgage.fixed_installment, mortgage.currency),
    },
    {
      label: t('details.metrics.principalFinanced'),
      value: formatCurrency(mortgage.principal_financed, mortgage.currency),
    },
    {
      label: t('details.metrics.totalInterestPaid'),
      value: formatCurrency(mortgage.total_interest_paid, mortgage.currency),
    },
    {
      label: t('details.metrics.totalPaid'),
      value: formatCurrency(mortgage.total_paid, mortgage.currency),
    },
    {
      label: t('details.metrics.tcea'),
      value: formatPercentageString(mortgage.tcea, { decimals: 6 }),
    },
    {
      label: t('details.metrics.periodicRate'),
      value: formatPercentageString(mortgage.periodic_rate, { decimals: 6 }),
    },
    {
      label: t('details.metrics.irr'),
      value: formatPercentageString(mortgage.irr, { decimals: 6 }),
    },
    mortgage.npv !== 0 && {
      label: t('details.metrics.npv'),
      value: formatCurrency(mortgage.npv, mortgage.currency),
    },
    {
      label: t('details.metrics.term'),
      value: t('details.fields.termMonths', { months: mortgage.term_months }),
    },
  ].filter(Boolean);

  const summaryDetails = [
    {
      label: t('details.fields.propertyPrice'),
      value: formatCurrency(mortgage.property_price, mortgage.currency),
    },
    {
      label: t('details.fields.downPayment'),
      value: formatCurrency(mortgage.down_payment, mortgage.currency),
    },
    {
      label: t('details.fields.loanAmount'),
      value: formatCurrency(mortgage.loan_amount, mortgage.currency),
    },
    {
      label: t('details.fields.bonusTechoPropio'),
      value: formatCurrency(mortgage.bono_techo_propio, mortgage.currency),
    },
    {
      label: t('details.fields.interestRate'),
      value: `${mortgage.interest_rate}% (${mortgage.rate_type})`,
    },
    {
      label: t('details.fields.gracePeriod'),
      value:
        mortgage.grace_period_type === 'NONE'
          ? t('details.fields.gracePeriodNone')
          : t('details.fields.gracePeriodValue', {
              months: mortgage.grace_period_months,
              type: mortgage.grace_period_type,
            }),
    },
  ];

  const headerContent = (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <button
          onClick={() => navigate('/mortgage/history')}
          className="mb-2 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          {t('details.back')}
        </button>
        <h1 className="text-3xl font-semibold text-foreground">
          {t('details.title', { id: mortgage.id })}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t('details.createdOn', { date: formatDate(mortgage.created_at) })}
        </p>
      </div>
      <div className="flex gap-2">
        {!isEditing ? (
          <>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              {t('details.edit')}
            </Button>
            <Button variant="ghost" className="text-destructive" onClick={handleDelete}>
              {t('details.delete')}
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              setIsEditing(false);
              setError(null);
            }}
          >
            {t('details.cancel')}
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <MortgagePageLayout header={headerContent}>
      {error && mortgage && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isEditing ? (
        <Card className="border-border/70 bg-card/90">
          <CardHeader>
            <CardTitle>{t('details.editTitle')}</CardTitle>
          </CardHeader>
          <CardContent>
            <MortgageCalculatorForm
              onCalculate={handleUpdate}
              loading={updateLoading}
              initialData={{
                property_price: mortgage.property_price,
                down_payment: mortgage.down_payment,
                loan_amount: mortgage.loan_amount,
                bono_techo_propio: mortgage.bono_techo_propio,
                interest_rate: mortgage.interest_rate,
                rate_type: mortgage.rate_type,
                term_months: mortgage.term_months,
                grace_period_months: mortgage.grace_period_months,
                grace_period_type: mortgage.grace_period_type,
                currency: mortgage.currency,
                npv_discount_rate: mortgage.npv_discount_rate || 0,
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="border-border/70 bg-card/90">
            <CardHeader>
              <CardTitle>{t('details.summaryTitle')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <MetricsGrid metrics={metrics} />
              <KeyValueGrid items={summaryDetails} />
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90">
            <CardHeader>
              <CardTitle>{t('details.amortizationSchedule')}</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentScheduleTable schedule={mortgage.payment_schedule} />
            </CardContent>
          </Card>
        </>
      )}
    </MortgagePageLayout>
  );
};

export default MortgageDetailPage;
