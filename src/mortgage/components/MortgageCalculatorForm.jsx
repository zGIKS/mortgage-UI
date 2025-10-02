import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../shared/components/Input';
import { Button } from '../../shared/components/Button';

const MortgageCalculatorForm = ({ onCalculate, loading, initialData }) => {
  const { t } = useTranslation('mortgage');
  const [formData, setFormData] = useState(initialData || {
    property_price: '',
    down_payment: '',
    loan_amount: '',
    bono_techo_propio: '',
    interest_rate: '',
    rate_type: 'NOMINAL',
    term_months: '',
    grace_period_months: '',
    grace_period_type: 'NONE',
    currency: 'PEN',
    npv_discount_rate: ''
  });

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
      property_price: parseFloat(formData.property_price),
      down_payment: parseFloat(formData.down_payment),
      loan_amount: parseFloat(formData.loan_amount),
      bono_techo_propio: parseFloat(formData.bono_techo_propio) || 0,
      interest_rate: parseFloat(formData.interest_rate),
      rate_type: formData.rate_type,
      term_months: parseInt(formData.term_months),
      grace_period_months: parseInt(formData.grace_period_months) || 0,
      grace_period_type: formData.grace_period_type,
      currency: formData.currency,
      npv_discount_rate: parseFloat(formData.npv_discount_rate) || 0
    };

    onCalculate(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('calculator.form.propertyPrice')}
          type="number"
          name="property_price"
          value={formData.property_price}
          onChange={handleChange}
          placeholder={t('calculator.form.propertyPricePlaceholder')}
          required
          step="0.01"
        />

        <Input
          label={t('calculator.form.downPayment')}
          type="number"
          name="down_payment"
          value={formData.down_payment}
          onChange={handleChange}
          placeholder={t('calculator.form.downPaymentPlaceholder')}
          required
          step="0.01"
        />

        <Input
          label={t('calculator.form.loanAmount')}
          type="number"
          name="loan_amount"
          value={formData.loan_amount}
          onChange={handleChange}
          placeholder={t('calculator.form.loanAmountPlaceholder')}
          required
          step="0.01"
        />

        <Input
          label={t('calculator.form.bonusTechoPropio')}
          type="number"
          name="bono_techo_propio"
          value={formData.bono_techo_propio}
          onChange={handleChange}
          placeholder={t('calculator.form.bonusTechoPropioPlaceholder')}
          step="0.01"
        />

        <Input
          label={t('calculator.form.interestRate')}
          type="number"
          name="interest_rate"
          value={formData.interest_rate}
          onChange={handleChange}
          placeholder={t('calculator.form.interestRatePlaceholder')}
          required
          step="0.01"
        />

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-300 mb-1">{t('calculator.form.rateType')}</label>
          <select
            name="rate_type"
            value={formData.rate_type}
            onChange={handleChange}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="NOMINAL">{t('calculator.form.options.rateTypes.nominal')}</option>
            <option value="EFFECTIVE">{t('calculator.form.options.rateTypes.effective')}</option>
          </select>
        </div>

        <Input
          label={t('calculator.form.loanTerm')}
          type="number"
          name="term_months"
          value={formData.term_months}
          onChange={handleChange}
          placeholder={t('calculator.form.loanTermPlaceholder')}
          required
        />

        <Input
          label={t('calculator.form.gracePeriodMonths')}
          type="number"
          name="grace_period_months"
          value={formData.grace_period_months}
          onChange={handleChange}
          placeholder={t('calculator.form.gracePeriodMonthsPlaceholder')}
        />

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-300 mb-1">{t('calculator.form.gracePeriodType')}</label>
          <select
            name="grace_period_type"
            value={formData.grace_period_type}
            onChange={handleChange}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="NONE">{t('calculator.form.options.gracePeriodTypes.none')}</option>
            <option value="TOTAL">{t('calculator.form.options.gracePeriodTypes.total')}</option>
            <option value="PARTIAL">{t('calculator.form.options.gracePeriodTypes.partial')}</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-300 mb-1">{t('calculator.form.currency')}</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          >
            <option value="PEN">{t('calculator.form.options.currencies.pen')}</option>
            <option value="USD">{t('calculator.form.options.currencies.usd')}</option>
          </select>
        </div>

        <Input
          label={t('calculator.form.npvDiscountRate')}
          type="number"
          name="npv_discount_rate"
          value={formData.npv_discount_rate}
          onChange={handleChange}
          placeholder={t('calculator.form.npvDiscountRatePlaceholder')}
          step="0.01"
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading 
            ? t('shared:common.loading')
            : (initialData ? t('shared:common.save') : t('calculator.form.calculate'))
          }
        </Button>
      </div>
    </form>
  );
};

export default MortgageCalculatorForm;
