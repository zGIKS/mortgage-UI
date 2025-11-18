import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import MortgageCalculatorForm from '../components/MortgageCalculatorForm';
import PaymentScheduleTable from '../components/PaymentScheduleTable';
import { mortgageService } from '../api/mortgageService';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import MortgagePageLayout from '../components/layout/MortgagePageLayout';
import MetricsGrid from '../components/common/MetricsGrid';
import KeyValueGrid from '../components/common/KeyValueGrid';
import { useFinancialFormatters } from '../hooks/useFinancialFormatters';

const MortgageCalculatorPage = () => {
  const { t } = useTranslation('mortgage');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { formatCurrency, formatPercentageString } = useFinancialFormatters();

  const handleCalculate = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await mortgageService.calculateMortgage(formData);
      setResult(data);
    } catch (err) {
      setError(err?.message || t('shared.errors.calculationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const summaryMetrics = result
    ? [
        {
          label: t('pages.calculator.results.monthlyPayment'),
          value: formatCurrency(result.fixed_installment, result.currency),
          accent: 'text-primary',
        },
        {
          label: t('shared.financial.terms.principal'),
          value: formatCurrency(result.principal_financed, result.currency),
          accent: 'text-primary',
        },
        {
          label: t('pages.calculator.results.totalInterest'),
          value: formatCurrency(result.total_interest_paid, result.currency),
          accent: 'text-secondary',
        },
        {
          label: t('pages.calculator.results.totalCost'),
          value: formatCurrency(result.total_paid, result.currency),
          accent: 'text-secondary',
        },
        {
          label: 'TCEA',
          value: formatPercentageString(result.tcea, { fromDecimal: true }),
          accent: 'text-destructive',
        },
        {
          label: t('pages.details.metrics.periodicRate'),
          value: formatPercentageString(result.periodic_rate, { fromDecimal: true }),
          accent: 'text-primary',
        },
        {
          label: 'IRR',
          value: formatPercentageString(result.irr, { fromDecimal: true }),
          accent: 'text-primary',
        },
        result.npv !== 0 && {
          label: 'NPV',
          value: formatCurrency(result.npv, result.currency),
          accent: 'text-secondary',
        },
        {
          label: t('pages.details.metrics.term'),
          value: t('pages.history.card.termMonths', { months: result.term_months }),
          accent: 'text-muted-foreground',
        },
      ].filter(Boolean)
    : [];

  const loanDetails = result
    ? [
        {
          label: t('pages.details.fields.propertyPrice'),
          value: formatCurrency(result.property_price, result.currency),
        },
        {
          label: t('pages.details.fields.downPayment'),
          value: formatCurrency(result.down_payment, result.currency),
        },
        {
          label: t('pages.details.fields.loanAmount'),
          value: formatCurrency(result.loan_amount, result.currency),
        },
        {
          label: t('pages.details.fields.bonusTechoPropio'),
          value: formatCurrency(result.bono_techo_propio, result.currency),
        },
        {
          label: t('pages.details.fields.interestRate'),
          value: `${result.interest_rate}% (${result.rate_type})`,
        },
        {
          label: t('pages.details.fields.gracePeriod'),
          value:
            result.grace_period_type === 'NONE'
              ? t('pages.details.fields.gracePeriodNone')
              : t('pages.details.fields.gracePeriodValue', {
                  months: result.grace_period_months,
                  type: result.grace_period_type,
                }),
        },
      ]
    : [];

  return (
    <MortgagePageLayout
      title={t('pages.calculator.title')}
      subtitle={t('pages.calculator.subtitle')}
    >
      <Card className="border-border/70 bg-card/90">
        <CardHeader>
          <CardTitle>{t('pages.details.loanInfo')}</CardTitle>
          <CardDescription>{t('pages.calculator.subtitle')}</CardDescription>
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
              <CardTitle>{t('pages.calculator.results.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <MetricsGrid metrics={summaryMetrics} />
              <KeyValueGrid items={loanDetails} />
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90">
            <CardHeader>
              <CardTitle>{t('pages.calculator.amortization.title')}</CardTitle>
            </CardHeader>
            <CardContent>
              <PaymentScheduleTable schedule={result.payment_schedule} />
            </CardContent>
          </Card>
        </>
      )}
    </MortgagePageLayout>
  );
};

export default MortgageCalculatorPage;
