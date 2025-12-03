import { useState } from 'react';
import { Check, Building2, TrendingDown, Info } from 'lucide-react';
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
import { bankConfigurations, formatBankConfigForForm, getBestRateBank } from '@/data/bankConfigurations';

const BankSelector = ({ onBankSelect, selectedBankId, mancomunado = false }) => {
  const [showMancomunadoOption, setShowMancomunadoOption] = useState(false);
  const bestBank = getBestRateBank();

  const handleBankChange = (bankId) => {
    const bankConfig = bankConfigurations.find(b => b.id === bankId);
    if (bankConfig) {
      const formattedConfig = formatBankConfigForForm(bankConfig.config, mancomunado);
      onBankSelect(bankId, formattedConfig, bankConfig);

      // Mostrar opción de seguro mancomunado solo si no es "custom"
      setShowMancomunadoOption(bankId !== 'custom');
    }
  };

  const handleMancomunadoChange = (value) => {
    const isMancomunado = value === 'mancomunado';
    const bankConfig = bankConfigurations.find(b => b.id === selectedBankId);
    if (bankConfig) {
      const formattedConfig = formatBankConfigForForm(bankConfig.config, isMancomunado);
      onBankSelect(selectedBankId, formattedConfig, bankConfig);
    }
  };

  const selectedBank = bankConfigurations.find(b => b.id === selectedBankId);

  return (
    <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
      <CardContent className="pt-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <Label htmlFor="bank_selector" className="text-base font-semibold">
                Seleccione la Entidad Bancaria
              </Label>
            </div>
            {bestBank && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="secondary" className="gap-1">
                    <TrendingDown className="h-3 w-3" />
                    Mejor tasa: {bestBank.name}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{bestBank.name} ofrece la tasa más baja: {(bestBank.config.tasa_anual * 100).toFixed(2)}%</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Bank Selector */}
          <div className="space-y-2">
            <Select value={selectedBankId} onValueChange={handleBankChange}>
              <SelectTrigger id="bank_selector" className="h-12">
                <SelectValue placeholder="Seleccione un banco para autocompletar seguros y comisiones" />
              </SelectTrigger>
              <SelectContent>
                <div className="p-2">
                  <p className="text-xs text-muted-foreground mb-2">Bancos con Programa MiVivienda</p>
                </div>
                {bankConfigurations
                  .filter(bank => bank.mivivienda)
                  .map((bank) => (
                    <SelectItem key={bank.id} value={bank.id} className="cursor-pointer">
                      <div className="flex items-center justify-between w-full">
                        <span className="font-medium">{bank.name}</span>
                        <span className="text-xs text-muted-foreground ml-4">
                          {(bank.config.tasa_anual * 100).toFixed(2)}% TEA
                        </span>
                      </div>
                    </SelectItem>
                  ))}
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
                        {(selectedBank.config.tasa_anual * 100).toFixed(2)}%
                      </p>
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

export default BankSelector;
