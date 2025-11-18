import { useState } from 'react';
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
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="property_price">{t('pages.calculator.form.propertyPrice')}</Label>
          <Input
            id="property_price"
            type="number"
            name="property_price"
            value={formData.property_price}
            onChange={handleChange}
            placeholder={t('pages.calculator.form.propertyPricePlaceholder')}
            required
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="down_payment">{t('pages.calculator.form.downPayment')}</Label>
          <Input
            id="down_payment"
            type="number"
            name="down_payment"
            value={formData.down_payment}
            onChange={handleChange}
            placeholder={t('pages.calculator.form.downPaymentPlaceholder')}
            required
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="loan_amount">{t('pages.calculator.form.loanAmount')}</Label>
          <Input
            id="loan_amount"
            type="number"
            name="loan_amount"
            value={formData.loan_amount}
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
          <Label htmlFor="interest_rate">{t('pages.calculator.form.interestRate')}</Label>
          <Input
            id="interest_rate"
            type="number"
            name="interest_rate"
            value={formData.interest_rate}
            onChange={handleChange}
            placeholder={t('pages.calculator.form.interestRatePlaceholder')}
            required
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rate_type">{t('pages.calculator.form.rateType')}</Label>
          <Select
            value={formData.rate_type}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, rate_type: value }))}
          >
            <SelectTrigger id="rate_type">
              <SelectValue />
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
          <Label htmlFor="term_months">{t('pages.calculator.form.loanTerm')}</Label>
          <Input
            id="term_months"
            type="number"
            name="term_months"
            value={formData.term_months}
            onChange={handleChange}
            placeholder={t('pages.calculator.form.loanTermPlaceholder')}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grace_period_months">{t('pages.calculator.form.gracePeriodMonths')}</Label>
          <Input
            id="grace_period_months"
            type="number"
            name="grace_period_months"
            value={formData.grace_period_months}
            onChange={handleChange}
            placeholder={t('pages.calculator.form.gracePeriodMonthsPlaceholder')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grace_period_type">{t('pages.calculator.form.gracePeriodType')}</Label>
          <Select
            value={formData.grace_period_type}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, grace_period_type: value }))}
          >
            <SelectTrigger id="grace_period_type">
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
          <Label htmlFor="currency">{t('pages.calculator.form.currency')}</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, currency: value }))}
          >
            <SelectTrigger id="currency">
              <SelectValue />
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

        <div className="space-y-2">
          <Label htmlFor="npv_discount_rate">{t('pages.calculator.form.npvDiscountRate')}</Label>
          <Input
            id="npv_discount_rate"
            type="number"
            name="npv_discount_rate"
            value={formData.npv_discount_rate}
            onChange={handleChange}
            placeholder={t('pages.calculator.form.npvDiscountRatePlaceholder')}
            step="0.01"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} variant="default">
          {loading
            ? t('shared:common.loading')
            : initialData
            ? t('shared:common.save')
            : t('pages.calculator.form.calculate')}
        </Button>
      </div>
    </form>
  );
};

export default MortgageCalculatorForm;
