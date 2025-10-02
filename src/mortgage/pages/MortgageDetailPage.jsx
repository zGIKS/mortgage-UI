import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { mortgageService } from '../api/mortgageService';
import PaymentScheduleTable from '../components/PaymentScheduleTable';
import MortgageCalculatorForm from '../components/MortgageCalculatorForm';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { Sidebar } from '../../shared/components/Sidebar';

const MortgageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('mortgage');
  const [mortgage, setMortgage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value) => {
    return value ? parseFloat(value).toFixed(6) : '0.000000';
  };

  const formatRateType = (rateType) => {
    return rateType === 'EFFECTIVE' ? t('calculator.form.options.rateTypes.effective') : t('calculator.form.options.rateTypes.nominal');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const fetchMortgage = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await mortgageService.getMortgageById(id);
      setMortgage(data);
    } catch (err) {
      setError(err?.message || t('details.messages.loadingError'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (formData) => {
    setUpdateLoading(true);
    setError(null);

    try {
      const updatedData = await mortgageService.updateMortgage(id, formData);
      setMortgage(updatedData);
      setIsEditing(false);
    } catch (err) {
      setError(err?.message || t('details.messages.updateError'));
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(t('details.confirmDelete'))) {
      return;
    }

    try {
      await mortgageService.deleteMortgage(id);
      navigate('/mortgage/history');
    } catch (err) {
      alert(t('details.messages.deleteError') + ': ' + (err?.message || 'Unknown error'));
    }
  };

  useEffect(() => {
    fetchMortgage();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Sidebar />
        <Header />
        <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error && !mortgage) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Sidebar />
        <Header />
        <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-400">{error}</p>
          </div>
          <Button onClick={() => navigate('/mortgage/history')}>
            {t('details.backToHistory')}
          </Button>
        </main>
      </div>
    );
  }

  if (!mortgage) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <Header />

      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => navigate('/mortgage/history')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {t('details.back')}
              </button>
            </div>
            <h1 className="text-3xl font-bold text-white">{t('details.title', { id: mortgage.id })}</h1>
            <p className="mt-2 text-gray-400">{t('details.createdOn', { date: formatDate(mortgage.created_at) })}</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            {!isEditing ? (
              <>
                <Button onClick={() => setIsEditing(true)}>
                  {t('details.edit')}
                </Button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-800 rounded-lg transition-colors"
                >
                  {t('details.delete')}
                </button>
              </>
            ) : (
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                }}
                variant="outline"
              >
                {t('details.cancel')}
              </Button>
            )}
          </div>
        </div>

        {error && mortgage && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {isEditing ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">{t('details.editTitle')}</h2>
            <MortgageCalculatorForm
              onCalculate={handleUpdate}
              loading={updateLoading}
              initialData={{
                property_price: mortgage.property_price,
                down_payment: mortgage.down_payment,
                loan_amount: mortgage.loan_amount,
                bono_techo_propio: mortgage.bono_techo_propio,
                interest_rate: mortgage.interest_rate,
                rate_type: mortgage.rate_type,
                term_months: mortgage.term_months,
                grace_period_months: mortgage.grace_period_months,
                grace_period_type: mortgage.grace_period_type,
                currency: mortgage.currency,
                npv_discount_rate: mortgage.npv_discount_rate || 0
              }}
            />
          </div>
        ) : (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">{t('details.summaryTitle')}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">{t('details.metrics.fixedInstallment')}</p>
                  <p className="text-2xl font-bold text-blue-400">{mortgage.currency} {formatCurrency(mortgage.fixed_installment)}</p>
                </div>

                <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">{t('details.metrics.principalFinanced')}</p>
                  <p className="text-2xl font-bold text-green-400">{mortgage.currency} {formatCurrency(mortgage.principal_financed)}</p>
                </div>

                <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">{t('details.metrics.totalInterestPaid')}</p>
                  <p className="text-2xl font-bold text-purple-400">{mortgage.currency} {formatCurrency(mortgage.total_interest_paid)}</p>
                </div>

                <div className="bg-indigo-900/20 border border-indigo-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">{t('details.metrics.totalPaid')}</p>
                  <p className="text-2xl font-bold text-indigo-400">{mortgage.currency} {formatCurrency(mortgage.total_paid)}</p>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">{t('details.metrics.tcea')}</p>
                  <p className="text-2xl font-bold text-yellow-400">{formatPercentage(mortgage.tcea)}%</p>
                </div>

                <div className="bg-pink-900/20 border border-pink-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">{t('details.metrics.periodicRate')}</p>
                  <p className="text-2xl font-bold text-pink-400">{formatPercentage(mortgage.periodic_rate)}%</p>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">{t('details.metrics.irr')}</p>
                  <p className="text-2xl font-bold text-gray-300">{formatPercentage(mortgage.irr)}%</p>
                </div>

                {mortgage.npv !== 0 && (
                  <div className="bg-teal-900/20 border border-teal-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">{t('details.metrics.npv')}</p>
                    <p className="text-2xl font-bold text-teal-400">{mortgage.currency} {formatCurrency(mortgage.npv)}</p>
                  </div>
                )}

                <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">{t('details.metrics.term')}</p>
                  <p className="text-2xl font-bold text-orange-400">{t('details.fields.termMonths', { months: mortgage.term_months })}</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">{t('details.fields.propertyPrice')}</span>
                  <span className="font-semibold text-white">{mortgage.currency} {formatCurrency(mortgage.property_price)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">{t('details.fields.downPayment')}</span>
                  <span className="font-semibold text-white">{mortgage.currency} {formatCurrency(mortgage.down_payment)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">{t('details.fields.loanAmount')}</span>
                  <span className="font-semibold text-white">{mortgage.currency} {formatCurrency(mortgage.loan_amount)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">{t('details.fields.bonusTechoPropio')}</span>
                  <span className="font-semibold text-white">{mortgage.currency} {formatCurrency(mortgage.bono_techo_propio)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">{t('details.fields.interestRate')}</span>
                  <span className="font-semibold text-white">{mortgage.interest_rate}% ({formatRateType(mortgage.rate_type)})</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">{t('details.fields.gracePeriod')}</span>
                  <span className="font-semibold text-white">
                    {mortgage.grace_period_type === 'NONE' ? 
                      t('details.fields.gracePeriodNone') : 
                      t('details.fields.gracePeriodValue', { 
                        months: mortgage.grace_period_months, 
                        type: mortgage.grace_period_type 
                      })
                    }
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">{t('details.amortizationSchedule')}</h2>
              <PaymentScheduleTable schedule={mortgage.payment_schedule} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MortgageDetailPage;
