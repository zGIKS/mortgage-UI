import { useMemo } from 'react';

const defaultCurrencyFormatter = () =>
  new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const useFinancialFormatters = () => {
  const currencyFormatter = useMemo(() => defaultCurrencyFormatter(), []);

  const formatCurrency = (value = 0, currencySymbol) => {
    const formatted = currencyFormatter.format(Number(value) || 0);
    return currencySymbol ? `${currencySymbol} ${formatted}` : formatted;
  };

  const formatPercentage = (value = 0, { decimals = 4, fromDecimal = false } = {}) => {
    const numericValue = Number(value) || 0;
    const scaledValue = fromDecimal ? numericValue * 100 : numericValue;
    return scaledValue.toFixed(decimals);
  };

  const formatPercentageString = (value = 0, options = {}) =>
    `${formatPercentage(value, options)}%`;

  const formatDate = (value) =>
    value
      ? new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

  return {
    formatCurrency,
    formatPercentage,
    formatPercentageString,
    formatDate,
  };
};
