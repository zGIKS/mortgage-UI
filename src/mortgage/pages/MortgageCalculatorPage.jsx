import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import MortgageCalculatorForm from '../components/MortgageCalculatorForm';
import PaymentScheduleTable from '../components/PaymentScheduleTable';
import { mortgageService } from '../api/mortgageService';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import MortgagePageLayout from '../components/layout/MortgagePageLayout';
import MetricsGrid from '../components/common/MetricsGrid';
import KeyValueGrid from '../components/common/KeyValueGrid';
import { useFinancialFormatters } from '../hooks/useFinancialFormatters';

const defaultFormValues = {
  precio_venta: '',
  cuota_inicial: '',
  monto_prestamo: '',
  bono_techo_propio: '',
  tasa_anual: '',
  tipo_tasa: 'NOMINAL',
  plazo_meses: '',
  meses_gracia: '',
  tipo_gracia: 'NONE',
  moneda: 'PEN',
  tasa_descuento: '',
  dias_anio: '360',
  frecuencia_pago: '30',
};

const MortgageCalculatorPage = () => {
  const { t } = useTranslation('mortgage');
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [bankInfo, setBankInfo] = useState(null);
  const { formatCurrency, formatPercentageString } = useFinancialFormatters();

  const propertyKeys = useMemo(
    () => [
      'precio_venta',
      'cuota_inicial',
      'monto_prestamo',
      'bono_techo_propio',
      'tasa_anual',
      'tipo_tasa',
      'frecuencia_pago',
      'dias_anio',
      'plazo_meses',
      'meses_gracia',
      'tipo_gracia',
      'moneda',
      'tasa_descuento',
    ],
    []
  );

  // Leer parámetros de URL cuando viene desde la página de bancos o desde el Home
  useEffect(() => {
    const bankName = searchParams.get('bankName');
    const tasaAnual = searchParams.get('tasa_anual');
    const tipoTasa = searchParams.get('tipo_tasa');
    const moneda = searchParams.get('moneda');
    const diasAnio = searchParams.get('dias_anio');
    const frecuenciaPago = searchParams.get('frecuencia_pago');
    const date = searchParams.get('date');

    const propertyParams = propertyKeys.reduce((acc, key) => {
      const value = searchParams.get(key);
      if (value !== null) acc[key] = value;
      return acc;
    }, {});

    let newInitialData = Object.keys(propertyParams).length
      ? { ...defaultFormValues, ...propertyParams }
      : null;

    if (bankName && tasaAnual) {
      setBankInfo({
        name: bankName,
        rate: tasaAnual,
        date: date,
        currency: moneda === 'USD' ? 'Dólares (USD)' : 'Soles (MN)'
      });

      const bankPrefill = {
        tasa_anual: tasaAnual,
        tipo_tasa: tipoTasa || newInitialData?.tipo_tasa || 'EFFECTIVE',
        moneda: moneda || newInitialData?.moneda || 'PEN',
        dias_anio: diasAnio || newInitialData?.dias_anio || '360',
        frecuencia_pago: frecuenciaPago || newInitialData?.frecuencia_pago || '30',
      };

      newInitialData = {
        ...(newInitialData || defaultFormValues),
        ...bankPrefill,
      };
    }

    if (newInitialData) {
      setInitialData(newInitialData);
    }
  }, [searchParams]);

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
          value: `${formatPercentageString(result.tasa_anual, { fromDecimal: true })} (${result.tipo_tasa})`,
        },
        {
          label: t('pages.details.fields.daysInYear'),
          value: result.dias_anio,
        },
        {
          label: t('pages.details.fields.paymentFrequency'),
          value: `${result.frecuencia_pago} ${t('pages.calculator.form.options.days')}`,
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
          <MortgageCalculatorForm
            key={initialData ? JSON.stringify(initialData) : 'default'}
            onCalculate={handleCalculate}
            loading={loading}
            initialData={initialData}
          />
        </CardContent>
      </Card>

      {/* Información del banco si viene desde la página de bancos */}
      {bankInfo && (
        <Alert className="bg-primary/5 border-primary/20">
          <Info className="h-4 w-4 text-primary" />
          <AlertDescription>
            {(() => {
              const numericRate = parseFloat(bankInfo.rate);
              const displayRate = formatPercentageString(
                numericRate || 0,
                { fromDecimal: !Number.isNaN(numericRate) && numericRate <= 1 }
              );
              return (
                <>
                  <strong className="text-primary">{bankInfo.name}</strong> - Tasa: {displayRate} TEA |
                  Moneda: {bankInfo.currency} | Fecha: {bankInfo.date}
                </>
              );
            })()}
            <br />
            <span className="text-xs text-muted-foreground">
              Los campos de tasa, tipo de tasa y moneda han sido pre-llenados. Complete los demás campos para calcular.
            </span>
          </AlertDescription>
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
              <PaymentScheduleTable schedule={result.cronograma_pagos} />
            </CardContent>
          </Card>
        </>
      )}
    </MortgagePageLayout>
  );
};

export default MortgageCalculatorPage;
