import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { mortgageService } from '../api/mortgageService';
import PaymentScheduleTable from '../components/PaymentScheduleTable';
import MortgageCalculatorForm from '../components/MortgageCalculatorForm';
import { Header } from '../../shared/components/Header';
import { Sidebar } from '../../shared/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const metricAccent = [
  'text-chart-1',
  'text-chart-2',
  'text-chart-3',
  'text-chart-4',
  'text-chart-5',
  'text-destructive',
  'text-muted-foreground',
  'text-chart-2',
  'text-accent-foreground',
];

const MortgageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('mortgage');
  const [mortgage, setMortgage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatPercentage = (value) => (value ? parseFloat(value).toFixed(6) : '0.000000');

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const fetchMortgage = async () => {
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
  };

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
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <main className="lg:ml-72 px-4 sm:px-6 lg:px-10 py-10">
          <div className="flex h-64 items-center justify-center">
            <span className="text-muted-foreground">{t('shared:common.loading')}</span>
          </div>
        </main>
      </div>
    );
  }

  if (error && !mortgage) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <main className="lg:ml-72 px-4 sm:px-6 lg:px-10 py-10 space-y-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button variant="outline" onClick={() => navigate('/mortgage/history')}>
            {t('details.backToHistory')}
          </Button>
        </main>
      </div>
    );
  }

  if (!mortgage) {
    return null;
  }

  const metrics = [
    {
      label: t('details.metrics.fixedInstallment'),
      value: `${mortgage.currency} ${formatCurrency(mortgage.fixed_installment)}`,
    },
    {
      label: t('details.metrics.principalFinanced'),
      value: `${mortgage.currency} ${formatCurrency(mortgage.principal_financed)}`,
    },
    {
      label: t('details.metrics.totalInterestPaid'),
      value: `${mortgage.currency} ${formatCurrency(mortgage.total_interest_paid)}`,
    },
    {
      label: t('details.metrics.totalPaid'),
      value: `${mortgage.currency} ${formatCurrency(mortgage.total_paid)}`,
    },
    {
      label: t('details.metrics.tcea'),
      value: `${formatPercentage(mortgage.tcea)}%`,
    },
    {
      label: t('details.metrics.periodicRate'),
      value: `${formatPercentage(mortgage.periodic_rate)}%`,
    },
    {
      label: t('details.metrics.irr'),
      value: `${formatPercentage(mortgage.irr)}%`,
    },
    mortgage.npv !== 0 && {
      label: t('details.metrics.npv'),
      value: `${mortgage.currency} ${formatCurrency(mortgage.npv)}`,
    },
    {
      label: t('details.metrics.term'),
      value: t('details.fields.termMonths', { months: mortgage.term_months }),
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />

      <main className="lg:ml-72 px-4 sm:px-6 lg:px-10 py-10 space-y-8">
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
              <Button variant="outline" onClick={() => {
                setIsEditing(false);
                setError(null);
              }}>
                {t('details.cancel')}
              </Button>
            )}
          </div>
        </div>

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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {metrics.map((metric, index) => (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-border/60 bg-card/80 p-4"
                    >
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      <p className={`text-2xl font-semibold ${metricAccent[index % metricAccent.length]}`}>
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-4 text-sm md:grid-cols-2">
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{t('details.fields.propertyPrice')}</span>
                    <span className="font-semibold text-foreground">
                      {mortgage.currency} {formatCurrency(mortgage.property_price)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{t('details.fields.downPayment')}</span>
                    <span className="font-semibold text-foreground">
                      {mortgage.currency} {formatCurrency(mortgage.down_payment)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{t('details.fields.loanAmount')}</span>
                    <span className="font-semibold text-foreground">
                      {mortgage.currency} {formatCurrency(mortgage.loan_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{t('details.fields.bonusTechoPropio')}</span>
                    <span className="font-semibold text-foreground">
                      {mortgage.currency} {formatCurrency(mortgage.bono_techo_propio)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{t('details.fields.interestRate')}</span>
                    <span className="font-semibold text-foreground">
                      {mortgage.interest_rate}% ({mortgage.rate_type})
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{t('details.fields.gracePeriod')}</span>
                    <span className="font-semibold text-foreground">
                      {mortgage.grace_period_type === 'NONE'
                        ? t('details.fields.gracePeriodNone')
                        : t('details.fields.gracePeriodValue', {
                            months: mortgage.grace_period_months,
                            type: mortgage.grace_period_type,
                          })}
                    </span>
                  </div>
                </div>
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
      </main>
    </div>
  );
};

export default MortgageDetailPage;
