import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MortgageCalculatorForm from '../components/MortgageCalculatorForm';
import PaymentScheduleTable from '../components/PaymentScheduleTable';
import { mortgageService } from '../api/mortgageService';
import { Header } from '../../shared/components/Header';
import { Sidebar } from '../../shared/components/Sidebar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const MetricCard = ({ label, value, accent }) => (
  <div className="rounded-xl border border-border/60 bg-card/80 p-4">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className={`text-2xl font-semibold ${accent}`}>{value}</p>
  </div>
);

const MortgageCalculatorPage = () => {
  const { t } = useTranslation('mortgage');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatPercentage = (value) => (value * 100).toFixed(4);

  const handleCalculate = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await mortgageService.calculateMortgage(formData);
      setResult(data);
    } catch (err) {
      setError(err?.message || t('errors.calculationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const summaryMetrics = result
    ? [
        {
          label: t('calculator.results.monthlyPayment'),
          value: `${result.currency} ${formatCurrency(result.fixed_installment)}`,
          accent: 'text-sky-400',
        },
        {
          label: t('financial.terms.principal'),
          value: `${result.currency} ${formatCurrency(result.principal_financed)}`,
          accent: 'text-emerald-400',
        },
        {
          label: t('calculator.results.totalInterest'),
          value: `${result.currency} ${formatCurrency(result.total_interest_paid)}`,
          accent: 'text-purple-400',
        },
        {
          label: t('calculator.results.totalCost'),
          value: `${result.currency} ${formatCurrency(result.total_paid)}`,
          accent: 'text-indigo-400',
        },
        {
          label: 'TCEA',
          value: `${formatPercentage(result.tcea)}%`,
          accent: 'text-amber-400',
        },
        {
          label: t('details.metrics.periodicRate'),
          value: `${formatPercentage(result.periodic_rate)}%`,
          accent: 'text-pink-400',
        },
        {
          label: 'IRR',
          value: `${formatPercentage(result.irr)}%`,
          accent: 'text-slate-200',
        },
        result.npv !== 0 && {
          label: 'NPV',
          value: `${result.currency} ${formatCurrency(result.npv)}`,
          accent: 'text-teal-400',
        },
        {
          label: t('details.metrics.term'),
          value: t('history.card.termMonths', { months: result.term_months }),
          accent: 'text-orange-400',
        },
      ].filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <Header />

      <main className="lg:ml-72 px-4 sm:px-6 lg:px-10 py-10 space-y-8">
        <div>
          <p className="text-sm text-muted-foreground">{t('calculator.subtitle')}</p>
          <h1 className="text-3xl font-semibold text-foreground">{t('calculator.title')}</h1>
        </div>

        <Card className="border-border/70 bg-card/90">
          <CardHeader>
            <CardTitle>{t('details.loanInfo')}</CardTitle>
            <CardDescription>{t('calculator.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <MortgageCalculatorForm onCalculate={handleCalculate} loading={loading} />
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <>
            <Card className="border-border/70 bg-card/90">
              <CardHeader>
                <CardTitle>{t('calculator.results.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {summaryMetrics.map((metric) => (
                    <MetricCard key={metric.label} {...metric} />
                  ))}
                </div>
                <div className="grid gap-4 text-sm md:grid-cols-2">
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{t('details.fields.propertyPrice')}</span>
                    <span className="font-semibold text-foreground">
                      {result.currency} {formatCurrency(result.property_price)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{t('details.fields.downPayment')}</span>
                    <span className="font-semibold text-foreground">
                      {result.currency} {formatCurrency(result.down_payment)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{t('details.fields.loanAmount')}</span>
                    <span className="font-semibold text-foreground">
                      {result.currency} {formatCurrency(result.loan_amount)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{t('details.fields.bonusTechoPropio')}</span>
                    <span className="font-semibold text-foreground">
                      {result.currency} {formatCurrency(result.bono_techo_propio)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{t('details.fields.interestRate')}</span>
                    <span className="font-semibold text-foreground">
                      {result.interest_rate}% ({result.rate_type})
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-border/50 pb-2">
                    <span className="text-muted-foreground">{t('details.fields.gracePeriod')}</span>
                    <span className="font-semibold text-foreground">
                      {result.grace_period_type === 'NONE'
                        ? t('details.fields.gracePeriodNone')
                        : t('details.fields.gracePeriodValue', {
                            months: result.grace_period_months,
                            type: result.grace_period_type,
                          })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/70 bg-card/90">
              <CardHeader>
                <CardTitle>{t('amortization.title')}</CardTitle>
              </CardHeader>
              <CardContent>
                <PaymentScheduleTable schedule={result.payment_schedule} />
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
};

export default MortgageCalculatorPage;
