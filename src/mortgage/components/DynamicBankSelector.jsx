import { useState, useEffect } from 'react';
import { Check, Building2, TrendingDown, Info, RefreshCw, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { bankConfigurations, formatBankConfigForForm } from '@/data/bankConfigurations';
import { bankRatesService } from '@/bank/api/bankRatesService';

/**
 * Componente de selector de banco que combina:
 * - Tasas DINÁMICAS desde la API de SBS (actualizadas diariamente)
 * - Seguros y comisiones ESTÁTICAS de configuración local
 */
const DynamicBankSelector = ({ onBankSelect, selectedBankId, mancomunado = false, moneda = 'PEN' }) => {
  const [showMancomunadoOption, setShowMancomunadoOption] = useState(false);
  const [bankRates, setBankRates] = useState(null);
  const [loadingRates, setLoadingRates] = useState(false);
  const [ratesDate, setRatesDate] = useState(null);
  const [error, setError] = useState(null);

  // Mapeo de nombres de la API a IDs de configuración
  const API_TO_CONFIG_MAP = {
    'BBVA': 'bbva',
    'Crédito': 'bcp',
    'Interbank': 'interbank',
    'Scotiabank': 'scotiabank',
    'GNB': 'gnb',
    'Pichincha': 'pichincha',
    'Bancom': 'bancom',
    'BIF': 'bif',
    'Citibank': 'citibank',
    'Mibanco': 'mibanco',
  };

  // Obtener tasas de la API
  const fetchBankRates = async () => {
    setLoadingRates(true);
    setError(null);
    try {
      const currency = moneda === 'PEN' ? 'mn' : 'usd';
      const data = await bankRatesService.getMortgageRates(currency);

      // Convertir las tasas de la API a un mapa para fácil acceso
      const ratesMap = {};
      data.banks.forEach(bank => {
        const configId = API_TO_CONFIG_MAP[bank.name];
        if (configId && bank.rate) {
          ratesMap[configId] = {
            rate: bank.rate / 100, // Convertir de 7.53 a 0.0753
            name: bank.name
          };
        }
      });

      setBankRates(ratesMap);
      setRatesDate(data.formattedDate);
    } catch (error) {
      console.error('Error fetching bank rates:', error);
      setError('No se pudieron obtener las tasas actuales');
    } finally {
      setLoadingRates(false);
    }
  };

  // Cargar tasas al montar el componente o cambiar moneda
  useEffect(() => {
    fetchBankRates();
  }, [moneda]);

  const handleBankChange = (bankId) => {
    const bankConfig = bankConfigurations.find(b => b.id === bankId);
    if (bankConfig) {
      // Usar tasa de la API si está disponible, sino usar la del config
      const dynamicRate = bankRates?.[bankId];
      const configToUse = {
        ...bankConfig.config,
        tasa_anual: dynamicRate ? dynamicRate.rate : bankConfig.config.tasa_anual
      };

      const formattedConfig = formatBankConfigForForm(configToUse, mancomunado);

      // Agregar información de la fuente de la tasa
      const enrichedBankInfo = {
        ...bankConfig,
        rateSource: dynamicRate ? 'API_SBS' : 'CONFIG',
        rateDate: dynamicRate ? ratesDate : null,
        currentRate: dynamicRate ? dynamicRate.rate : bankConfig.config.tasa_anual
      };

      onBankSelect(bankId, formattedConfig, enrichedBankInfo);

      // Mostrar opción de seguro mancomunado solo si no es "custom"
      setShowMancomunadoOption(bankId !== 'custom');
    }
  };

  const handleMancomunadoChange = (value) => {
    const isMancomunado = value === 'mancomunado';
    const bankConfig = bankConfigurations.find(b => b.id === selectedBankId);
    if (bankConfig) {
      // Usar tasa de la API si está disponible
      const dynamicRate = bankRates?.[selectedBankId];
      const configToUse = {
        ...bankConfig.config,
        tasa_anual: dynamicRate ? dynamicRate.rate : bankConfig.config.tasa_anual
      };

      const formattedConfig = formatBankConfigForForm(configToUse, isMancomunado);

      const enrichedBankInfo = {
        ...bankConfig,
        rateSource: dynamicRate ? 'API_SBS' : 'CONFIG',
        rateDate: dynamicRate ? ratesDate : null,
        currentRate: dynamicRate ? dynamicRate.rate : bankConfig.config.tasa_anual
      };

      onBankSelect(selectedBankId, formattedConfig, enrichedBankInfo);
    }
  };

  const selectedBank = bankConfigurations.find(b => b.id === selectedBankId);
  const selectedBankRate = bankRates?.[selectedBankId];

  // Obtener el banco con la mejor tasa (de la API o config)
  const getBestRateBank = () => {
    let bestBank = null;
    let bestRate = Infinity;

    bankConfigurations
      .filter(bank => bank.id !== 'custom')
      .forEach(bank => {
        const rate = bankRates?.[bank.id]?.rate || bank.config.tasa_anual;
        if (rate < bestRate) {
          bestRate = rate;
          bestBank = bank;
        }
      });

    return bestBank;
  };

  const bestBank = getBestRateBank();

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <Label htmlFor="bank_selector" className="text-base font-semibold">
                Seleccione la Entidad Bancaria
              </Label>
              {loadingRates && (
                <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
            <div className="flex items-center gap-2">
              {ratesDate && (
                <Badge variant="outline" className="gap-1 text-xs">
                  <Calendar className="h-3 w-3" />
                  {ratesDate}
                </Badge>
              )}
              {bestBank && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="gap-1">
                      <TrendingDown className="h-3 w-3" />
                      Mejor tasa: {bestBank.name}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{bestBank.name} ofrece la tasa más baja</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription className="flex items-center justify-between">
                <span className="text-sm">{error}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchBankRates}
                  className="h-7"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Reintentar
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Bank Selector */}
          <div className="space-y-2">
            <Select value={selectedBankId} onValueChange={handleBankChange}>
              <SelectTrigger id="bank_selector" className="h-12">
                <SelectValue placeholder="Seleccione un banco para autocompletar" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <p className="text-xs text-muted-foreground mb-2">
                    Bancos con Programa MiVivienda
                    {!loadingRates && ratesDate && (
                      <span className="text-primary ml-1">(Tasas actualizadas)</span>
                    )}
                  </p>
                </div>
                {bankConfigurations
                  .filter(bank => bank.mivivienda)
                  .map((bank) => {
                    const apiRate = bankRates?.[bank.id];
                    const displayRate = apiRate ? apiRate.rate : bank.config.tasa_anual;

                    return (
                      <SelectItem key={bank.id} value={bank.id} className="cursor-pointer">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{bank.name}</span>
                            {apiRate && (
                              <Badge variant="outline" className="text-[10px] px-1 py-0">
                                En vivo
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground ml-4">
                            {(displayRate * 100).toFixed(2)}% TEA
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                <div className="p-2 border-t mt-2">
                  <p className="text-xs text-muted-foreground mb-2">Otras opciones</p>
                </div>
                {bankConfigurations
                  .filter(bank => !bank.mivivienda)
                  .map((bank) => (
                    <SelectItem key={bank.id} value={bank.id} className="cursor-pointer">
                      <span className="font-medium">{bank.name}</span>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Seguro Mancomunado Option */}
          {showMancomunadoOption && selectedBankId && (
            <div className="space-y-2">
              <Label htmlFor="tipo_seguro" className="text-sm">Tipo de Seguro de Desgravamen</Label>
              <Select
                defaultValue="individual"
                onValueChange={handleMancomunadoChange}
              >
                <SelectTrigger id="tipo_seguro">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">
                    Individual - {selectedBank && (selectedBank.config.seguro_desgravamen * 100).toFixed(3)}% mensual
                  </SelectItem>
                  <SelectItem value="mancomunado">
                    Mancomunado - {selectedBank && (selectedBank.config.seguro_desgravamen_mancomunado * 100).toFixed(3)}% mensual
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                El seguro mancomunado cubre a ambos cónyuges
              </p>
            </div>
          )}

          {/* Selected Bank Info */}
          {selectedBank && selectedBank.id !== 'custom' && (
            <Alert className="border-primary/20 bg-primary/5">
              <Info className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                <div className="space-y-2 mt-2">
                  <p className="font-semibold">{selectedBank.fullName}</p>
                  <ul className="space-y-1 ml-2">
                    {selectedBank.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs">
                        <Check className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-primary/10">
                    <div>
                      <p className="text-xs font-medium">Tasa Anual:</p>
                      <p className="text-sm text-primary font-bold">
                        {selectedBankRate
                          ? (selectedBankRate.rate * 100).toFixed(2)
                          : (selectedBank.config.tasa_anual * 100).toFixed(2)
                        }%
                      </p>
                      {selectedBankRate && (
                        <p className="text-[10px] text-green-600 flex items-center gap-1">
                          <Badge variant="outline" className="h-4 px-1 text-[9px]">API SBS</Badge>
                          Actualizada
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium">Seg. Desgravamen:</p>
                      <p className="text-sm">
                        {(selectedBank.config.seguro_desgravamen * 100).toFixed(3)}% mensual
                      </p>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {selectedBank && selectedBank.id === 'custom' && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Modo personalizado: Configure manualmente todos los valores según sus necesidades.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DynamicBankSelector;
