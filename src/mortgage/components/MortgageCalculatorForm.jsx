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
    numero_anios: '',
    meses_gracia: '',
    tipo_gracia: 'NONE',
    moneda: 'PEN',
    tasa_descuento: '',
    cok: '',
    dias_anio: '360',
    frecuencia: 'MENSUAL',
    frecuencia_pago: '0',
    comision_desembolso: '',
    comision_evaluacion: '',
    gastos_administrativos: '',
    portes: '',
    seguro_desgravamen: '',
    seguro_inmueble_anual: '',
    costos_mensuales_adicionales: ''
  };

  const toPercentValue = (value) => {
    const numeric = parseFloat(value);
    if (Number.isNaN(numeric)) return '';
    return numeric <= 1 ? numeric * 100 : numeric;
  };

  const hydrateForm = (data) => ({
    ...defaultFormData,
    ...data,
    tasa_anual: data?.tasa_anual !== undefined ? toPercentValue(data.tasa_anual) : '',
    tasa_descuento: data?.tasa_descuento !== undefined ? toPercentValue(data.tasa_descuento) : '',
    cok: data?.cok !== undefined ? toPercentValue(data.cok) : '',
    seguro_desgravamen: data?.seguro_desgravamen !== undefined ? toPercentValue(data.seguro_desgravamen) : '',
  });

  const [formData, setFormData] = useState(() => (initialData ? hydrateForm(initialData) : defaultFormData));

  useEffect(() => {
    if (initialData) {
      setFormData(hydrateForm(initialData));
    }
  }, [initialData]);

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
      bono_techo_propio: parseFloat(formData.bono_techo_propio) || 0,
      cok: (parseFloat(formData.cok) || 0) / 100,
      comision_desembolso: parseFloat(formData.comision_desembolso) || 0,
      comision_evaluacion: parseFloat(formData.comision_evaluacion) || 0,
      costos_mensuales_adicionales: parseFloat(formData.costos_mensuales_adicionales) || 0,
      cuota_inicial: parseFloat(formData.cuota_inicial),
      dias_anio: parseInt(formData.dias_anio),
      frecuencia: formData.frecuencia,
      frecuencia_pago: parseInt(formData.frecuencia_pago),
      gastos_administrativos: parseFloat(formData.gastos_administrativos) || 0,
      meses_gracia: parseInt(formData.meses_gracia) || 0,
      moneda: formData.moneda,
      monto_prestamo: parseFloat(formData.monto_prestamo),
      numero_anios: parseInt(formData.numero_anios) || 0,
      plazo_meses: parseInt(formData.plazo_meses),
      portes: parseFloat(formData.portes) || 0,
      precio_venta: parseFloat(formData.precio_venta),
      seguro_desgravamen: (parseFloat(formData.seguro_desgravamen) || 0) / 100,
      seguro_inmueble_anual: parseFloat(formData.seguro_inmueble_anual) || 0,
      tasa_anual: parseFloat(formData.tasa_anual) / 100,
      tasa_descuento: (parseFloat(formData.tasa_descuento) || 0) / 100,
      tipo_gracia: formData.tipo_gracia,
      tipo_tasa: formData.tipo_tasa
    };

    console.log('🔍 Payload being sent:', JSON.stringify(payload, null, 2));
    onCalculate(payload);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos Básicos del Préstamo */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Datos Básicos del Préstamo</CardTitle>
          </CardHeader>
          <CardContent>
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
            </div>
          </CardContent>
        </Card>

        {/* Tasas y Plazos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tasas y Plazos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                <Label htmlFor="numero_anios">Número de Años</Label>
                <Input
                  id="numero_anios"
                  type="number"
                  name="numero_anios"
                  value={formData.numero_anios}
                  onChange={handleChange}
                  placeholder="Ej: 20"
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
                <Label htmlFor="cok">COK (Costo de Oportunidad) %</Label>
                <Input
                  id="cok"
                  type="number"
                  name="cok"
                  value={formData.cok}
                  onChange={handleChange}
                  placeholder="Ej: 12.5"
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
                <Label htmlFor="frecuencia">Frecuencia</Label>
                <Select
                  value={formData.frecuencia}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, frecuencia: value }))}
                >
                  <SelectTrigger id="frecuencia">
                    <SelectValue placeholder="Mensual" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MENSUAL">Mensual</SelectItem>
                    <SelectItem value="QUINCENAL">Quincenal</SelectItem>
                    <SelectItem value="TRIMESTRAL">Trimestral</SelectItem>
                    <SelectItem value="SEMESTRAL">Semestral</SelectItem>
                    <SelectItem value="ANUAL">Anual</SelectItem>
                  </SelectContent>
                </Select>
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
          </CardContent>
        </Card>

        {/* Comisiones y Gastos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Comisiones y Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="comision_desembolso">Comisión de Desembolso</Label>
                <Input
                  id="comision_desembolso"
                  type="number"
                  name="comision_desembolso"
                  value={formData.comision_desembolso}
                  onChange={handleChange}
                  placeholder="Ej: 500"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="comision_evaluacion">Comisión de Evaluación</Label>
                <Input
                  id="comision_evaluacion"
                  type="number"
                  name="comision_evaluacion"
                  value={formData.comision_evaluacion}
                  onChange={handleChange}
                  placeholder="Ej: 300"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gastos_administrativos">Gastos Administrativos</Label>
                <Input
                  id="gastos_administrativos"
                  type="number"
                  name="gastos_administrativos"
                  value={formData.gastos_administrativos}
                  onChange={handleChange}
                  placeholder="Ej: 50"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="portes">Portes</Label>
                <Input
                  id="portes"
                  type="number"
                  name="portes"
                  value={formData.portes}
                  onChange={handleChange}
                  placeholder="Ej: 20"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="costos_mensuales_adicionales">Costos Mensuales Adicionales</Label>
                <Input
                  id="costos_mensuales_adicionales"
                  type="number"
                  name="costos_mensuales_adicionales"
                  value={formData.costos_mensuales_adicionales}
                  onChange={handleChange}
                  placeholder="Ej: 100"
                  step="0.01"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seguros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Seguros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="seguro_desgravamen">Seguro de Desgravamen %</Label>
                <Input
                  id="seguro_desgravamen"
                  type="number"
                  name="seguro_desgravamen"
                  value={formData.seguro_desgravamen}
                  onChange={handleChange}
                  placeholder="Ej: 0.05"
                  step="0.01"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="seguro_inmueble_anual">Seguro de Inmueble Anual</Label>
                <Input
                  id="seguro_inmueble_anual"
                  type="number"
                  name="seguro_inmueble_anual"
                  value={formData.seguro_inmueble_anual}
                  onChange={handleChange}
                  placeholder="Ej: 200"
                  step="0.01"
                />
              </div>
            </div>
          </CardContent>
        </Card>

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
