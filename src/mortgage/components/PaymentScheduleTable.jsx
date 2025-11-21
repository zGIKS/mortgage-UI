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

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('pages.calculator.amortization.table.period')}</TableHead>
            <TableHead className="text-right">{t('pages.calculator.amortization.table.installment')}</TableHead>
            <TableHead className="text-right">{t('pages.calculator.amortization.table.interest')}</TableHead>
            <TableHead className="text-right">{t('pages.calculator.amortization.table.amortization')}</TableHead>
            <TableHead className="text-right">{t('pages.calculator.amortization.table.balance')}</TableHead>
            <TableHead className="text-center">{t('pages.calculator.amortization.table.gracePeriod')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedule.map((payment, index) => (
            <TableRow key={`${payment.periodo}-${index}`} className="hover:bg-muted/40">
              <TableCell className="font-medium">{payment.periodo}</TableCell>
              <TableCell className="text-right">{formatCurrency(payment.cuota)}</TableCell>
              <TableCell className="text-right">{formatCurrency(payment.interes)}</TableCell>
              <TableCell className="text-right">{formatCurrency(payment.amortizacion)}</TableCell>
              <TableCell className="text-right">{formatCurrency(payment.saldo_final)}</TableCell>
              <TableCell className="text-center">
                {payment.es_periodo_gracia ? (
                  <Badge variant="secondary">{t('pages.calculator.amortization.table.yes')}</Badge>
                ) : (
                  <Badge variant="outline" className="text-muted-foreground">
                    {t('pages.calculator.amortization.table.none')}
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentScheduleTable;
