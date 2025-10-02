import { useTranslation } from 'react-i18next';

const PaymentScheduleTable = ({ schedule }) => {
  const { t } = useTranslation('mortgage');
  if (!schedule || schedule.length === 0) {
    return null;
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
        <thead className="bg-gray-900">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">{t('amortization.table.period')}</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">{t('amortization.table.installment')}</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">{t('amortization.table.interest')}</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">{t('amortization.table.amortization')}</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">{t('amortization.table.balance')}</th>
            <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider border-b border-gray-700">{t('amortization.table.gracePeriod')}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {schedule.map((payment, index) => (
            <tr key={index} className={payment.is_grace_period ? 'bg-yellow-900/20' : 'hover:bg-gray-700/50'}>
              <td className="px-4 py-3 text-sm text-gray-200">{payment.period}</td>
              <td className="px-4 py-3 text-sm text-gray-200 text-right">{formatCurrency(payment.installment)}</td>
              <td className="px-4 py-3 text-sm text-gray-200 text-right">{formatCurrency(payment.interest)}</td>
              <td className="px-4 py-3 text-sm text-gray-200 text-right">{formatCurrency(payment.amortization)}</td>
              <td className="px-4 py-3 text-sm text-gray-200 text-right">{formatCurrency(payment.remaining_balance)}</td>
              <td className="px-4 py-3 text-sm text-center">
                {payment.is_grace_period ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-900/30 text-yellow-400 border border-yellow-800">
                    {t('amortization.table.yes')}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-400 border border-gray-600">
                    {t('amortization.table.none')}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentScheduleTable;
