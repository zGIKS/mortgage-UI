import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import { bankService } from '../api/bankService';

const MortgageCalculatorForm = ({ onCalculate, loading, initialData }) => {
  const { t } = useTranslation('mortgage');
  const [banks, setBanks] = useState([]);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [selectedBank, setSelectedBank] = useState(null);

  const [formData, setFormData] = useState(initialData || {
    banco_id: '',
    precio_venta: '',
    cuota_inicial: '',
    monto_prestamo: '',
    bono_techo_propio: '',
    tea: '',
    plazo_meses: '',
    meses_gracia: '',
    tipo_gracia: 'NONE',
    moneda: 'PEN',
    tasa_descuento: ''
  });

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const data = await bankService.getAllBanks();
        setBanks(data);
      } catch (error) {
        console.error('Error fetching banks:', error);
      } finally {
        setLoadingBanks(false);
      }
    };
    fetchBanks();
  }, []);

  useEffect(() => {
    if (formData.banco_id) {
      const bank = banks.find(b => b.id === formData.banco_id);
      setSelectedBank(bank || null);
    } else {
      setSelectedBank(null);
    }
  }, [formData.banco_id, banks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBankSelect = (bankId) => {
    setFormData(prev => ({
      ...prev,
      banco_id: bankId
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      banco_id: formData.banco_id,
      precio_venta: parseFloat(formData.precio_venta),
      cuota_inicial: parseFloat(formData.cuota_inicial),
      monto_prestamo: parseFloat(formData.monto_prestamo),
      bono_techo_propio: parseFloat(formData.bono_techo_propio) || 0,
      tea: parseFloat(formData.tea),
      plazo_meses: parseInt(formData.plazo_meses),
      meses_gracia: parseInt(formData.meses_gracia) || 0,
      tipo_gracia: formData.tipo_gracia,
      moneda: formData.moneda,
      tasa_descuento: parseFloat(formData.tasa_descuento) || 0
    };

    onCalculate(payload);
  };

  return (
    <div className="space-y-6">
      {/* Bank Selection Card */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5" />
            {t('pages.calculator.form.selectBank')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingBanks ? (
            <p className="text-muted-foreground">{t('shared:common.loading')}</p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {banks.map((bank) => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => handleBankSelect(bank.id)}
                  className={`flex flex-col items-start gap-1 rounded-lg border p-4 text-left transition-all hover:border-primary/50 hover:bg-primary/10 ${
                    formData.banco_id === bank.id
                      ? 'border-primary bg-primary/10 ring-2 ring-primary/20'
                      : 'border-border'
                  }`}
                >
                  <span className="font-medium">{bank.name}</span>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>{t('pages.calculator.form.bankInfo.rateType')}: {bank.rateType}</span>
                    <span>•</span>
                    <span>{t('pages.calculator.form.bankInfo.frequency')}: {bank.paymentFrequencyDays} {t('pages.calculator.form.bankInfo.days')}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          {selectedBank && (
            <div className="mt-4 rounded-md bg-muted/50 p-3 text-sm">
              <p className="font-medium">{t('pages.calculator.form.bankInfo.selected')}: {selectedBank.name}</p>
              <div className="mt-1 flex flex-wrap gap-4 text-muted-foreground">
                <span>{t('pages.calculator.form.bankInfo.rateType')}: {selectedBank.rateType}</span>
                <span>{t('pages.calculator.form.bankInfo.daysInYear')}: {selectedBank.daysInYear}</span>
                <span>{t('pages.calculator.form.bankInfo.frequency')}: {selectedBank.paymentFrequencyDays} {t('pages.calculator.form.bankInfo.days')}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mortgage Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="precio_venta">{t('pages.calculator.form.propertyPrice')}</Label>
            <Input
              id="precio_venta"
              type="number"
              name="precio_venta"
              value={formData.precio_venta}
              onChange={handleChange}
              placeholder={t('pages.calculator.form.propertyPricePlaceholder')}
              required
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cuota_inicial">{t('pages.calculator.form.downPayment')}</Label>
            <Input
              id="cuota_inicial"
              type="number"
              name="cuota_inicial"
              value={formData.cuota_inicial}
              onChange={handleChange}
              placeholder={t('pages.calculator.form.downPaymentPlaceholder')}
              required
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monto_prestamo">{t('pages.calculator.form.loanAmount')}</Label>
            <Input
              id="monto_prestamo"
              type="number"
              name="monto_prestamo"
              value={formData.monto_prestamo}
              onChange={handleChange}
              placeholder={t('pages.calculator.form.loanAmountPlaceholder')}
              required
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bono_techo_propio">{t('pages.calculator.form.bonusTechoPropio')}</Label>
            <Input
              id="bono_techo_propio"
              type="number"
              name="bono_techo_propio"
              value={formData.bono_techo_propio}
              onChange={handleChange}
              placeholder={t('pages.calculator.form.bonusTechoPropioPlaceholder')}
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tea">{t('pages.calculator.form.interestRate')}</Label>
            <Input
              id="tea"
              type="number"
              name="tea"
              value={formData.tea}
              onChange={handleChange}
              placeholder={t('pages.calculator.form.interestRatePlaceholder')}
              required
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="plazo_meses">{t('pages.calculator.form.loanTerm')}</Label>
            <Input
              id="plazo_meses"
              type="number"
              name="plazo_meses"
              value={formData.plazo_meses}
              onChange={handleChange}
              placeholder={t('pages.calculator.form.loanTermPlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="meses_gracia">{t('pages.calculator.form.gracePeriodMonths')}</Label>
            <Input
              id="meses_gracia"
              type="number"
              name="meses_gracia"
              value={formData.meses_gracia}
              onChange={handleChange}
              placeholder={t('pages.calculator.form.gracePeriodMonthsPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_gracia">{t('pages.calculator.form.gracePeriodType')}</Label>
            <Select
              value={formData.tipo_gracia}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo_gracia: value }))}
            >
              <SelectTrigger id="tipo_gracia">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NONE">
                  {t('pages.calculator.form.options.gracePeriodTypes.none')}
                </SelectItem>
                <SelectItem value="TOTAL">
                  {t('pages.calculator.form.options.gracePeriodTypes.total')}
                </SelectItem>
                <SelectItem value="PARCIAL">
                  {t('pages.calculator.form.options.gracePeriodTypes.partial')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="moneda">{t('pages.calculator.form.currency')}</Label>
            <Select
              value={formData.moneda}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, moneda: value }))}
            >
              <SelectTrigger id="moneda">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PEN">
                  {t('pages.calculator.form.options.currencies.pen')}
                </SelectItem>
                <SelectItem value="USD">
                  {t('pages.calculator.form.options.currencies.usd')}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tasa_descuento">{t('pages.calculator.form.npvDiscountRate')}</Label>
            <Input
              id="tasa_descuento"
              type="number"
              name="tasa_descuento"
              value={formData.tasa_descuento}
              onChange={handleChange}
              placeholder={t('pages.calculator.form.npvDiscountRatePlaceholder')}
              step="0.01"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading || !formData.banco_id}
            variant="default"
          >
            {loading
              ? t('shared:common.loading')
              : initialData
              ? t('shared:common.save')
              : t('pages.calculator.form.calculate')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MortgageCalculatorForm;
