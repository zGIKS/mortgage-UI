import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import MortgageCalculatorForm from '../components/MortgageCalculatorForm';
import PaymentScheduleTable from '../components/PaymentScheduleTable';
import { mortgageService } from '../api/mortgageService';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import MortgagePageLayout from '../components/layout/MortgagePageLayout';
import MetricsGrid from '../components/common/MetricsGrid';
import KeyValueGrid from '../components/common/KeyValueGrid';
import { useFinancialFormatters } from '../hooks/useFinancialFormatters';

const MortgageCalculatorPage = () => {
  const { t } = useTranslation('mortgage');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { formatCurrency, formatPercentageString } = useFinancialFormatters();

  const handleCalculate = async (formData) => {
    setLoading(true);
    setResult(null);

    try {
      const data = await mortgageService.calculateMortgage(formData);
      setResult(data);
      toast.success(t('shared.messages.calculationSuccess'));
    } catch (err) {
      toast.error(err?.message || t('shared.errors.calculationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const summaryMetrics = result
    ? [
        {
          label: t('pages.calculator.results.monthlyPayment'),
          value: formatCurrency(result.cuota_fija, result.moneda),
          accent: 'text-primary',
        },
        {
          label: t('shared.financial.terms.principal'),
          value: formatCurrency(result.saldo_financiar, result.moneda),
          accent: 'text-primary',
        },
        {
          label: t('pages.calculator.results.totalInterest'),
          value: formatCurrency(result.total_intereses, result.moneda),
          accent: 'text-secondary',
        },
        {
          label: t('pages.calculator.results.totalCost'),
          value: formatCurrency(result.total_pagado, result.moneda),
          accent: 'text-secondary',
        },
        {
          label: 'TCEA',
          value: formatPercentageString(result.tcea, { fromDecimal: true }),
          accent: 'text-destructive',
        },
        {
          label: t('pages.details.metrics.periodicRate'),
          value: formatPercentageString(result.tasa_periodo, { fromDecimal: true }),
          accent: 'text-primary',
        },
        {
          label: 'TIR',
          value: formatPercentageString(result.tir, { fromDecimal: true }),
          accent: 'text-primary',
        },
        result.van !== 0 && {
          label: 'VAN',
          value: formatCurrency(result.van, result.moneda),
          accent: 'text-secondary',
        },
        {
          label: t('pages.details.metrics.term'),
          value: t('pages.history.card.termMonths', { months: result.plazo_meses }),
          accent: 'text-muted-foreground',
        },
      ].filter(Boolean)
    : [];

  const loanDetails = result
    ? [
        {
          label: t('pages.details.fields.bank'),
          value: result.banco_nombre,
        },
        {
          label: t('pages.details.fields.propertyPrice'),
          value: formatCurrency(result.precio_venta, result.moneda),
        },
        {
          label: t('pages.details.fields.downPayment'),
          value: formatCurrency(result.cuota_inicial, result.moneda),
        },
        {
          label: t('pages.details.fields.loanAmount'),
          value: formatCurrency(result.monto_prestamo, result.moneda),
        },
        {
          label: t('pages.details.fields.bonusTechoPropio'),
          value: formatCurrency(result.bono_techo_propio, result.moneda),
        },
        {
          label: t('pages.details.fields.interestRate'),
          value: `${result.tea}% (${result.tipo_tasa})`,
        },
        {
          label: t('pages.details.fields.gracePeriod'),
          value:
            result.tipo_gracia === 'NONE'
              ? t('pages.details.fields.gracePeriodNone')
              : t('pages.details.fields.gracePeriodValue', {
                  months: result.meses_gracia,
                  type: result.tipo_gracia,
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
              <PaymentScheduleTable schedule={result.cronograma_pagos} />
            </CardContent>
          </Card>
        </>
      )}
    </MortgagePageLayout>
  );
};

export default MortgageCalculatorPage;
