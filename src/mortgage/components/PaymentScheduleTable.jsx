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
            <TableHead>{t('amortization.table.period')}</TableHead>
            <TableHead className="text-right">{t('amortization.table.installment')}</TableHead>
            <TableHead className="text-right">{t('amortization.table.interest')}</TableHead>
            <TableHead className="text-right">{t('amortization.table.amortization')}</TableHead>
            <TableHead className="text-right">{t('amortization.table.balance')}</TableHead>
            <TableHead className="text-center">{t('amortization.table.gracePeriod')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schedule.map((payment, index) => (
            <TableRow key={`${payment.period}-${index}`} className="hover:bg-muted/40">
              <TableCell className="font-medium">{payment.period}</TableCell>
              <TableCell className="text-right">{formatCurrency(payment.installment)}</TableCell>
              <TableCell className="text-right">{formatCurrency(payment.interest)}</TableCell>
              <TableCell className="text-right">{formatCurrency(payment.amortization)}</TableCell>
              <TableCell className="text-right">{formatCurrency(payment.remaining_balance)}</TableCell>
              <TableCell className="text-center">
                {payment.is_grace_period ? (
                  <Badge variant="secondary" className="bg-amber-500/20 text-amber-400">
                    {t('amortization.table.yes')}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-border/60 text-muted-foreground">
                    {t('amortization.table.none')}
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
