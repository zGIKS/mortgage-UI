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

const MortgageCalculatorForm = ({ onCalculate, loading, initialData }) => {
  const { t } = useTranslation('mortgage');

  const defaultFormData = {
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
    frecuencia_pago: '30'
  };

  const [formData, setFormData] = useState(initialData || defaultFormData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      precio_venta: parseFloat(formData.precio_venta),
      cuota_inicial: parseFloat(formData.cuota_inicial),
      monto_prestamo: parseFloat(formData.monto_prestamo),
      bono_techo_propio: parseFloat(formData.bono_techo_propio) || 0,
      tasa_anual: parseFloat(formData.tasa_anual),
      tipo_tasa: formData.tipo_tasa,
      plazo_meses: parseInt(formData.plazo_meses),
      meses_gracia: parseInt(formData.meses_gracia) || 0,
      tipo_gracia: formData.tipo_gracia,
      moneda: formData.moneda,
      tasa_descuento: parseFloat(formData.tasa_descuento) || 0,
      dias_anio: parseInt(formData.dias_anio),
      frecuencia_pago: parseInt(formData.frecuencia_pago)
    };

    console.log('🔍 Payload being sent:', JSON.stringify(payload, null, 2));
    onCalculate(payload);
  };

  return (
    <div className="space-y-6">
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
            <Label htmlFor="tasa_anual">{t('pages.calculator.form.interestRate')}</Label>
            <Input
              id="tasa_anual"
              type="number"
              name="tasa_anual"
              value={formData.tasa_anual}
              onChange={handleChange}
              placeholder={t('pages.calculator.form.interestRatePlaceholder')}
              required
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo_tasa">{t('pages.calculator.form.rateType')}</Label>
            <Select
              value={formData.tipo_tasa}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo_tasa: value }))}
            >
              <SelectTrigger id="tipo_tasa">
                <SelectValue placeholder={t('pages.calculator.form.options.rateTypes.nominal')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NOMINAL">
                  {t('pages.calculator.form.options.rateTypes.nominal')}
                </SelectItem>
                <SelectItem value="EFFECTIVE">
                  {t('pages.calculator.form.options.rateTypes.effective')}
                </SelectItem>
              </SelectContent>
            </Select>
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
                <SelectItem value="PARTIAL">
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
                <SelectValue placeholder={t('pages.calculator.form.options.currencies.pen')} />
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

          <div className="space-y-2">
            <Label htmlFor="dias_anio">{t('pages.calculator.form.daysInYear')}</Label>
            <Input
              id="dias_anio"
              type="number"
              name="dias_anio"
              value={formData.dias_anio}
              onChange={handleChange}
              placeholder={t('pages.calculator.form.daysInYearPlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frecuencia_pago">{t('pages.calculator.form.paymentFrequency')}</Label>
            <Input
              id="frecuencia_pago"
              type="number"
              name="frecuencia_pago"
              value={formData.frecuencia_pago}
              onChange={handleChange}
              placeholder={t('pages.calculator.form.paymentFrequencyPlaceholder')}
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            variant="default"
          >
            {loading
              ? t('shared:common.loading')
              : t('pages.calculator.form.calculate')}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MortgageCalculatorForm;
