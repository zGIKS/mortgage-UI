import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, Landmark, Loader2 } from 'lucide-react';
import { bankRatesService } from '../api/bankRatesService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import MortgagePageLayout from '../../mortgage/components/layout/MortgagePageLayout';

const BanksPage = () => {
  const { t, i18n } = useTranslation('bank');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [bankData, setBankData] = useState(null);
  const [currency, setCurrency] = useState('mn');

  // Inicializar con la fecha de ayer
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const [selectedDate, setSelectedDate] = useState(yesterday);

  // Máxima fecha permitida: ayer
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() - 1);

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

  const propertyData = useMemo(() => {
    const values = {};
    propertyKeys.forEach((key) => {
      const value = searchParams.get(key);
      if (value !== null) {
        values[key] = value;
      }
    });
    return values;
  }, [propertyKeys, searchParams]);

  const fetchBankRates = async (date, curr) => {
    setLoading(true);
    try {
      const formattedDate = bankRatesService.formatDateForAPI(date);
      const data = curr === 'mn'
        ? await bankRatesService.getMNRates(formattedDate)
        : await bankRatesService.getUSDRates(formattedDate);

      console.log('Bank rates data:', data);
      setBankData(data);
    } catch (error) {
      console.error('Error fetching bank rates:', error);
      toast.error(t('banks.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBankRates(selectedDate, currency);
  }, [selectedDate, currency]);

  const handleDateSelect = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  const handleCurrencyChange = (value) => {
    setCurrency(value);
  };

  const handleBankClick = (bank) => {
    // Navegar a la calculadora con los datos del banco pre-llenados
    const params = new URLSearchParams();
    Object.entries(propertyData).forEach(([key, value]) => params.set(key, value));

    params.set('bankName', bank.name);
    params.set('tasa_anual', bank.rate.toString());
    params.set('tipo_tasa', 'EFFECTIVE'); // Los bancos peruanos usan tasa efectiva
    params.set('moneda', currency === 'mn' ? 'PEN' : 'USD');
    params.set('dias_anio', '360');
    params.set('frecuencia_pago', '30');
    params.set('date', bankData.date);

    navigate(`/mortgage/calculator?${params.toString()}`);
  };

  const renderFilters = () => (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          {/* Selector de fecha */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="date-picker">{t('banks.filters.date')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-picker"
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, 'PPP', { locale: i18n.language === 'es' ? es : undefined })
                  ) : (
                    <span>{t('banks.filters.selectDate')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  disabled={(date) => date > maxDate || date > new Date()}
                  initialFocus
                  locale={i18n.language === 'es' ? es : undefined}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Selector de moneda */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="currency-select">{t('banks.filters.currency')}</Label>
            <Select value={currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger id="currency-select" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mn">{t('banks.filters.mn')}</SelectItem>
                <SelectItem value="usd">{t('banks.filters.usd')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    if (!bankData || bankData.banks.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-muted-foreground">{t('banks.noData')}</p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-6">
        {/* Grid de tarjetas de bancos */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {bankData.banks.map((bank) => (
            <Card
              key={bank.name}
              className="overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 cursor-pointer"
              onClick={() => handleBankClick(bank)}
            >
              <CardHeader className="bg-gradient-to-br from-primary/10 to-primary/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Landmark className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-semibold">{bank.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="text-center">
                    {bank.rate !== null ? (
                      <>
                        <div className="text-4xl font-bold text-primary">
                          {bank.rate.toFixed(2)}%
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {t('banks.card.rate')} {t('banks.card.annual')}
                        </p>
                      </>
                    ) : (
                      <div className="text-muted-foreground">
                        {t('banks.card.noRate')}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Nota informativa */}
        {bankData.note && (
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-xs text-muted-foreground">
              {t('banks.note')}
            </p>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {t('banks.source')}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <MortgagePageLayout
      title={t('banks.title')}
      subtitle={t('banks.subtitle')}
    >
      {Object.keys(propertyData).length > 0 && (
        <Card className="border-dashed border-primary/40 bg-primary/5">
          <CardContent className="flex flex-col gap-2 py-4 text-sm text-primary">
            <span className="font-semibold">{t('banks.selectedProperty.title')}</span>
            <span className="text-muted-foreground text-xs">
              {t('banks.selectedProperty.description')}
            </span>
          </CardContent>
        </Card>
      )}
      {renderFilters()}
      {renderContent()}
    </MortgagePageLayout>
  );
};

export { BanksPage };
export default BanksPage;
