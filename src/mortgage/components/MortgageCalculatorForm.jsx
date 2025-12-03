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
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { InfoIcon, AlertTriangle, Lightbulb } from 'lucide-react';
import BankSelector from './BankSelector';

const FieldTooltip = ({ title, description, example, range, warning, tip, icon = 'info' }) => {
  const IconComponent = icon === 'warning' ? AlertTriangle : icon === 'tip' ? Lightbulb : InfoIcon;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="ml-1 inline-flex items-center text-muted-foreground hover:text-foreground">
          <IconComponent className="h-4 w-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs p-4" side="right">
        <div className="space-y-2">
          <p className="font-semibold">{title}</p>
          <p className="text-xs">{description}</p>
          {example && (
            <div className="text-xs">
              <span className="font-medium">Ejemplo:</span> {example}
            </div>
          )}
          {range && (
            <div className="text-xs">
              <span className="font-medium">Rango permitido:</span> {range}
            </div>
          )}
          {warning && (
            <div className="flex gap-1 text-xs text-amber-500">
              <AlertTriangle className="h-3 w-3 flex-shrink-0 mt-0.5" />
              <span>{warning}</span>
            </div>
          )}
          {tip && (
            <div className="flex gap-1 text-xs text-blue-500">
              <Lightbulb className="h-3 w-3 flex-shrink-0 mt-0.5" />
              <span>{tip}</span>
            </div>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

const MortgageCalculatorForm = ({ onCalculate, loading, initialData }) => {
  const { t } = useTranslation('mortgage');

  const defaultFormData = {
    banco_id: '',
    precio_venta: '',
    cuota_inicial_porcentaje: '20',
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
    frecuencia_pago: '30',
    comision_desembolso: '',
    comision_evaluacion: '',
    gastos_administrativos: '',
    portes: '',
    seguro_desgravamen: '',
    seguro_inmueble_anual: '',
    costos_mensuales_adicionales: ''
  };

  const [selectedBankInfo, setSelectedBankInfo] = useState(null);

  const toPercentValue = (value) => {
    const numeric = parseFloat(value);
    if (Number.isNaN(numeric)) return '';
    return numeric <= 1 ? numeric * 100 : numeric;
  };

  const hydrateForm = (data) => {
    const cuotaInicialPorcentaje = data?.precio_venta && data?.cuota_inicial
      ? ((data.cuota_inicial / data.precio_venta) * 100).toFixed(2)
      : '';

    return {
      ...defaultFormData,
      ...data,
      cuota_inicial_porcentaje: cuotaInicialPorcentaje,
      tasa_anual: data?.tasa_anual !== undefined ? toPercentValue(data.tasa_anual) : '',
      tasa_descuento: data?.tasa_descuento !== undefined ? toPercentValue(data.tasa_descuento) : '',
      cok: data?.cok !== undefined ? toPercentValue(data.cok) : '',
      seguro_desgravamen: data?.seguro_desgravamen !== undefined ? toPercentValue(data.seguro_desgravamen) : '',
    };
  };

  const [formData, setFormData] = useState(() => (initialData ? hydrateForm(initialData) : defaultFormData));
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(hydrateForm(initialData));
    }
  }, [initialData]);

  // Auto-calculate monto_prestamo
  useEffect(() => {
    const precioVenta = parseFloat(formData.precio_venta);
    const cuotaInicialPct = parseFloat(formData.cuota_inicial_porcentaje);
    const bonoTechoPropio = parseFloat(formData.bono_techo_propio) || 0;

    if (!isNaN(precioVenta) && !isNaN(cuotaInicialPct)) {
      const cuotaInicial = (precioVenta * cuotaInicialPct) / 100;
      const montoPrestamo = precioVenta - cuotaInicial - bonoTechoPropio;
      setFormData(prev => ({
        ...prev,
        monto_prestamo: montoPrestamo.toFixed(2)
      }));
    }
  }, [formData.precio_venta, formData.cuota_inicial_porcentaje, formData.bono_techo_propio]);

  // Auto-calculate plazo_meses from numero_anios
  useEffect(() => {
    const numeroAnios = parseInt(formData.numero_anios);
    if (!isNaN(numeroAnios) && numeroAnios > 0) {
      setFormData(prev => ({
        ...prev,
        plazo_meses: (numeroAnios * 12).toString()
      }));
    }
  }, [formData.numero_anios]);

  const validateField = (name, value) => {
    const validations = {
      precio_venta: { min: 50000, max: 5000000, message: 'Debe estar entre S/ 50,000 y S/ 5,000,000' },
      cuota_inicial_porcentaje: { min: 10, max: 90, message: 'Debe estar entre 10% y 90%' },
      numero_anios: { min: 5, max: 30, message: 'Debe estar entre 5 y 30 años' },
      tasa_anual: { min: 0.1, max: 50, message: 'Debe estar entre 0.1% y 50%' },
      meses_gracia: { min: 0, max: 60, message: 'Debe estar entre 0 y 60 meses' },
    };

    const validation = validations[name];
    if (validation) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && (numValue < validation.min || numValue > validation.max)) {
        return validation.message;
      }
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate on change
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  // Handle bank selection and auto-fill
  const handleBankSelect = (bankId, bankConfig, bankInfo) => {
    setFormData(prev => ({
      ...prev,
      banco_id: bankId,
      tasa_anual: bankConfig.tasa_anual,
      tipo_tasa: bankConfig.tipo_tasa,
      seguro_desgravamen: bankConfig.seguro_desgravamen,
      seguro_inmueble_anual: bankConfig.seguro_inmueble_anual,
      comision_desembolso: bankConfig.comision_desembolso,
      comision_evaluacion: bankConfig.comision_evaluacion,
      gastos_administrativos: bankConfig.gastos_administrativos,
      portes: bankConfig.portes,
      dias_anio: bankConfig.dias_anio,
      frecuencia: bankConfig.frecuencia,
      frecuencia_pago: bankConfig.frecuencia_pago,
    }));
    setSelectedBankInfo(bankInfo);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate cuota_inicial from percentage
    const precioVenta = parseFloat(formData.precio_venta);
    const cuotaInicialPct = parseFloat(formData.cuota_inicial_porcentaje);
    const cuotaInicial = (precioVenta * cuotaInicialPct) / 100;

    const payload = {
      bono_techo_propio: parseFloat(formData.bono_techo_propio) || 0,
      cok: (parseFloat(formData.cok) || 0) / 100,
      comision_desembolso: parseFloat(formData.comision_desembolso) || 0,
      comision_evaluacion: parseFloat(formData.comision_evaluacion) || 0,
      costos_mensuales_adicionales: parseFloat(formData.costos_mensuales_adicionales) || 0,
      cuota_inicial: cuotaInicial,
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
      precio_venta: precioVenta,
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
    <TooltipProvider>
      <div className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bank Selector */}
          <BankSelector
            onBankSelect={handleBankSelect}
            selectedBankId={formData.banco_id}
          />

          {/* Datos Básicos del Préstamo */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Datos Básicos del Préstamo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="precio_venta">Precio de la Propiedad</Label>
                    <FieldTooltip
                      title="Precio de la propiedad"
                      description="Ingrese el precio total de la propiedad según cotización."
                      example="S/ 180,000.00"
                      range="S/ 50,000 - S/ 5,000,000"
                    />
                  </div>
                  <Input
                    id="precio_venta"
                    type="number"
                    name="precio_venta"
                    value={formData.precio_venta}
                    onChange={handleChange}
                    placeholder="Ej: 180000"
                    required
                    min="50000"
                    max="5000000"
                    step="1000"
                    className={errors.precio_venta ? 'border-red-500' : ''}
                  />
                  {errors.precio_venta && <p className="text-xs text-red-500">{errors.precio_venta}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="cuota_inicial_porcentaje">Cuota Inicial (%)</Label>
                    <FieldTooltip
                      title="Cuota inicial"
                      description="Porcentaje del precio que pagará como inicial."
                      example="20%"
                      range="Mínimo requerido por Fondo MiVivienda: 10%"
                      warning="Se recomienda 20%-30% para mejores condiciones"
                    />
                  </div>
                  <Input
                    id="cuota_inicial_porcentaje"
                    type="number"
                    name="cuota_inicial_porcentaje"
                    value={formData.cuota_inicial_porcentaje}
                    onChange={handleChange}
                    placeholder="Ej: 20"
                    required
                    min="10"
                    max="90"
                    step="0.1"
                    className={errors.cuota_inicial_porcentaje ? 'border-red-500' : ''}
                  />
                  {errors.cuota_inicial_porcentaje && <p className="text-xs text-red-500">{errors.cuota_inicial_porcentaje}</p>}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="monto_prestamo">Monto a Financiar</Label>
                    <FieldTooltip
                      title="Monto a financiar"
                      description="Monto que será financiado por el banco. Se calcula automáticamente: Precio - Cuota inicial - Bono (si aplica)."
                    />
                  </div>
                  <Input
                    id="monto_prestamo"
                    type="number"
                    name="monto_prestamo"
                    value={formData.monto_prestamo}
                    onChange={handleChange}
                    placeholder="Se calcula automáticamente"
                    required
                    step="0.01"
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="bono_techo_propio">Bono Techo Propio</Label>
                    <FieldTooltip
                      title="Bono Techo Propio"
                      description="Bono del Estado peruano que se aplica como parte del pago inicial."
                      example="S/ 15,000.00"
                    />
                  </div>
                  <Input
                    id="bono_techo_propio"
                    type="number"
                    name="bono_techo_propio"
                    value={formData.bono_techo_propio}
                    onChange={handleChange}
                    placeholder="Ej: 0"
                    step="1000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="moneda">Moneda</Label>
                  <Select
                    value={formData.moneda}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, moneda: value }))}
                  >
                    <SelectTrigger id="moneda">
                      <SelectValue placeholder="PEN" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PEN">Soles (PEN)</SelectItem>
                      <SelectItem value="USD">Dólares (USD)</SelectItem>
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
                  <div className="flex items-center">
                    <Label htmlFor="tasa_anual">Tasa de Interés Anual (%)</Label>
                    <FieldTooltip
                      title="Tasa de interés anual"
                      description="Tasa de interés anual del crédito hipotecario."
                      example="8.5%"
                    />
                  </div>
                  <Input
                    id="tasa_anual"
                    type="number"
                    name="tasa_anual"
                    value={formData.tasa_anual}
                    onChange={handleChange}
                    placeholder="Ej: 8.5"
                    required
                    min="0.1"
                    max="50"
                    step="0.01"
                    className={errors.tasa_anual ? 'border-red-500' : ''}
                  />
                  {errors.tasa_anual && <p className="text-xs text-red-500">{errors.tasa_anual}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo_tasa">Tipo de Tasa</Label>
                  <Select
                    value={formData.tipo_tasa}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo_tasa: value }))}
                  >
                    <SelectTrigger id="tipo_tasa">
                      <SelectValue placeholder="Nominal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NOMINAL">Nominal</SelectItem>
                      <SelectItem value="EFFECTIVE">Efectiva</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="numero_anios">Plazo del Crédito (años)</Label>
                    <FieldTooltip
                      title="Plazo del crédito"
                      description="Tiempo en años para pagar el crédito."
                      range="5-30 años"
                      warning="A mayor plazo: menor cuota mensual pero mayor costo total por intereses"
                    />
                  </div>
                  <Input
                    id="numero_anios"
                    type="number"
                    name="numero_anios"
                    value={formData.numero_anios}
                    onChange={handleChange}
                    placeholder="Ej: 20"
                    required
                    min="5"
                    max="30"
                    className={errors.numero_anios ? 'border-red-500' : ''}
                  />
                  {errors.numero_anios && <p className="text-xs text-red-500">{errors.numero_anios}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plazo_meses">Plazo en Meses</Label>
                  <Input
                    id="plazo_meses"
                    type="number"
                    name="plazo_meses"
                    value={formData.plazo_meses}
                    onChange={handleChange}
                    placeholder="Se calcula automáticamente"
                    required
                    readOnly
                    className="bg-muted"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="meses_gracia">Meses de Gracia</Label>
                    <FieldTooltip
                      title="Meses de gracia"
                      description="Período inicial donde no se paga amortización o solo se pagan intereses."
                      example="12 meses"
                      range="0-60 meses"
                      icon="tip"
                    />
                  </div>
                  <Input
                    id="meses_gracia"
                    type="number"
                    name="meses_gracia"
                    value={formData.meses_gracia}
                    onChange={handleChange}
                    placeholder="Ej: 0"
                    min="0"
                    max="60"
                    className={errors.meses_gracia ? 'border-red-500' : ''}
                  />
                  {errors.meses_gracia && <p className="text-xs text-red-500">{errors.meses_gracia}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo_gracia">Tipo de Gracia</Label>
                  <Select
                    value={formData.tipo_gracia}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo_gracia: value }))}
                  >
                    <SelectTrigger id="tipo_gracia">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">Sin gracia</SelectItem>
                      <SelectItem value="TOTAL">Total (no paga nada)</SelectItem>
                      <SelectItem value="PARTIAL">Parcial (solo intereses)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="cok">COK (Costo de Oportunidad) %</Label>
                    <FieldTooltip
                      title="COK (Costo de Oportunidad del Capital)"
                      description="Tasa externa usada para descontar el flujo de costos del cliente al calcular el VAN."
                      warning="No debe ser la misma tasa del crédito; use su tasa de oportunidad."
                      icon="tip"
                    />
                  </div>
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
                  <Label htmlFor="tasa_descuento">Tasa de Descuento VAN (%)</Label>
                  <Input
                    id="tasa_descuento"
                    type="number"
                    name="tasa_descuento"
                    value={formData.tasa_descuento}
                    onChange={handleChange}
                    placeholder="Ej: 8"
                    step="0.01"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Costos y Comisiones */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Costos y Comisiones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="costos_mensuales_adicionales">Costos Mensuales Adicionales</Label>
                    <FieldTooltip
                      title="Costos mensuales adicionales"
                      description="Otros gastos mensuales del cliente (NO incluye seguros ni comisiones, que se configuran por separado). Ejemplos: gastos de mantenimiento, servicios adicionales, etc."
                      warning="Estos costos se suman a los seguros y comisiones para calcular el costo total mensual en la TCEA y VAN."
                      icon="tip"
                    />
                  </div>
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

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="comision_evaluacion">Comisión de Evaluación</Label>
                    <FieldTooltip
                      title="Comisión de evaluación"
                      description="Comisión única que se cobra al evaluar el crédito."
                      example="S/ 500.00"
                    />
                  </div>
                  <Input
                    id="comision_evaluacion"
                    type="number"
                    name="comision_evaluacion"
                    value={formData.comision_evaluacion}
                    onChange={handleChange}
                    placeholder="Ej: 500"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="comision_desembolso">Comisión de Desembolso</Label>
                    <FieldTooltip
                      title="Comisión de desembolso"
                      description="Comisión única que se cobra al desembolsar el crédito."
                      example="S/ 300.00"
                    />
                  </div>
                  <Input
                    id="comision_desembolso"
                    type="number"
                    name="comision_desembolso"
                    value={formData.comision_desembolso}
                    onChange={handleChange}
                    placeholder="Ej: 300"
                    step="0.01"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="gastos_administrativos">Gastos Administrativos</Label>
                    <FieldTooltip
                      title="Gastos administrativos"
                      description="Gastos administrativos mensuales (portes, mantenimiento de cuenta, etc.)."
                      example="S/ 50.00"
                    />
                  </div>
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
                  <div className="flex items-center">
                    <Label htmlFor="seguro_desgravamen">Seguro de Desgravamen (%)</Label>
                    <FieldTooltip
                      title="Seguro de desgravamen"
                      description="Tasa mensual de seguro de desgravamen. Se calcula sobre el saldo del préstamo."
                      example="0.15% mensual"
                      icon="tip"
                    />
                  </div>
                  <Input
                    id="seguro_desgravamen"
                    type="number"
                    name="seguro_desgravamen"
                    value={formData.seguro_desgravamen}
                    onChange={handleChange}
                    placeholder="Ej: 0.05"
                    step="0.001"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label htmlFor="seguro_inmueble_anual">Seguro de Inmueble Anual (%)</Label>
                    <FieldTooltip
                      title="Seguro de inmueble"
                      description="Tasa anual de seguro de inmueble. Se divide entre 12 para obtener el monto mensual."
                      example="0.25% anual"
                      icon="tip"
                    />
                  </div>
                  <Input
                    id="seguro_inmueble_anual"
                    type="number"
                    name="seguro_inmueble_anual"
                    value={formData.seguro_inmueble_anual}
                    onChange={handleChange}
                    placeholder="Ej: 0.25"
                    step="0.01"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading || Object.values(errors).some(e => e !== null)}
              variant="default"
              size="lg"
            >
              {loading
                ? t('shared:common.loading')
                : t('pages.calculator.form.calculate')}
            </Button>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
};

export default MortgageCalculatorForm;
