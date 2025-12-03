import { useTranslation } from 'react-i18next';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const PaymentScheduleTable = ({ schedule }) => {
  const { t } = useTranslation('mortgage');
  if (!schedule || schedule.length === 0) {
    return null;
  }

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const formatPercent = (value) =>
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
      style: 'percent',
    }).format(value);

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Nº</TableHead>
            <TableHead className="text-center">Nº Año</TableHead>
            <TableHead className="text-right">TEA</TableHead>
            <TableHead className="text-right">TET</TableHead>
            <TableHead className="text-right">P.G.</TableHead>
            <TableHead className="text-right">Saldo Inicial</TableHead>
            <TableHead className="text-right">Interés</TableHead>
            <TableHead className="text-right">Cuota</TableHead>
            <TableHead className="text-right">Amort.</TableHead>
            <TableHead className="text-right">Portes</TableHead>
            <TableHead className="text-right">Gas. Adm.</TableHead>
            <TableHead className="text-right">Seguro</TableHead>
            <TableHead className="text-right">Saldo Final</TableHead>
            <TableHead className="text-right">Flujo TEA</TableHead>
            <TableHead className="text-right">Flujo TCEA</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedule.map((payment, index) => (
            <TableRow key={`${payment.periodo}-${index}`} className="hover:bg-muted/40">
              <TableCell className="text-center font-medium">{payment.periodo}</TableCell>
              <TableCell className="text-center">{payment.numero_anio || 0}</TableCell>
              <TableCell className="text-right text-xs">{formatPercent(payment.tasa_periodo || 0)}</TableCell>
              <TableCell className="text-right text-xs">{formatPercent(payment.tasa_periodo || 0)}</TableCell>
              <TableCell className="text-center">
                {payment.es_periodo_gracia ? (
                  <Badge variant="secondary" className="text-xs">{payment.tipo_gracia || 'S'}</Badge>
                ) : (
                  <span className="text-muted-foreground text-xs">-</span>
                )}
              </TableCell>
              <TableCell className="text-right">{formatCurrency(payment.saldo_inicial || payment.saldo_final + (payment.amortizacion || 0))}</TableCell>
              <TableCell className="text-right">{formatCurrency(payment.interes)}</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(payment.cuota)}</TableCell>
              <TableCell className="text-right">{formatCurrency(payment.amortizacion)}</TableCell>
              <TableCell className="text-right">{formatCurrency(payment.portes || 0)}</TableCell>
              <TableCell className="text-right">{formatCurrency(payment.gastos_administrativos || 0)}</TableCell>
              <TableCell className="text-right">{formatCurrency((payment.seguro_desgravamen || 0) + (payment.seguro_inmueble || 0))}</TableCell>
              <TableCell className="text-right font-medium">{formatCurrency(payment.saldo_final)}</TableCell>
              <TableCell className="text-right">{formatCurrency(payment.cuota_total || payment.cuota)}</TableCell>
              <TableCell className="text-right">{formatCurrency((payment.cuota_total || payment.cuota) + (payment.costos_adicionales || 0))}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentScheduleTable;
