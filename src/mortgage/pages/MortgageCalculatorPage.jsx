import { useState } from 'react';
import MortgageCalculatorForm from '../components/MortgageCalculatorForm';
import PaymentScheduleTable from '../components/PaymentScheduleTable';
import { mortgageService } from '../api/mortgageService';
import { Header } from '../../shared/components/Header';
import { Sidebar } from '../../shared/components/Sidebar';

const MortgageCalculatorPage = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercentage = (value) => {
    return (value * 100).toFixed(4);
  };

  const handleCalculate = async (formData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await mortgageService.calculateMortgage(formData);
      setResult(data);
    } catch (err) {
      setError(err?.message || 'Failed to calculate mortgage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <Header />

      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Calculator</h1>
          <p className="mt-2 text-gray-400">Calculate your mortgage using the French amortization method</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Enter Loan Details</h2>
          <MortgageCalculatorForm onCalculate={handleCalculate} loading={loading} />
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {result && (
          <>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">Calculation Summary</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Fixed Installment</p>
                  <p className="text-2xl font-bold text-blue-400">{result.currency} {formatCurrency(result.fixed_installment)}</p>
                </div>

                <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Principal Financed</p>
                  <p className="text-2xl font-bold text-green-400">{result.currency} {formatCurrency(result.principal_financed)}</p>
                </div>

                <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Total Interest Paid</p>
                  <p className="text-2xl font-bold text-purple-400">{result.currency} {formatCurrency(result.total_interest_paid)}</p>
                </div>

                <div className="bg-indigo-900/20 border border-indigo-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Total Paid</p>
                  <p className="text-2xl font-bold text-indigo-400">{result.currency} {formatCurrency(result.total_paid)}</p>
                </div>

                <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">TCEA</p>
                  <p className="text-2xl font-bold text-yellow-400">{formatPercentage(result.tcea)}%</p>
                </div>

                <div className="bg-pink-900/20 border border-pink-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Periodic Rate</p>
                  <p className="text-2xl font-bold text-pink-400">{formatPercentage(result.periodic_rate)}%</p>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">IRR</p>
                  <p className="text-2xl font-bold text-gray-300">{formatPercentage(result.irr)}%</p>
                </div>

                {result.npv !== 0 && (
                  <div className="bg-teal-900/20 border border-teal-800 rounded-lg p-4">
                    <p className="text-sm text-gray-400 mb-1">NPV</p>
                    <p className="text-2xl font-bold text-teal-400">{result.currency} {formatCurrency(result.npv)}</p>
                  </div>
                )}

                <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Term</p>
                  <p className="text-2xl font-bold text-orange-400">{result.term_months} months</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Property Price:</span>
                  <span className="font-semibold text-white">{result.currency} {formatCurrency(result.property_price)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Down Payment:</span>
                  <span className="font-semibold text-white">{result.currency} {formatCurrency(result.down_payment)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Loan Amount:</span>
                  <span className="font-semibold text-white">{result.currency} {formatCurrency(result.loan_amount)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Bono Techo Propio:</span>
                  <span className="font-semibold text-white">{result.currency} {formatCurrency(result.bono_techo_propio)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Interest Rate:</span>
                  <span className="font-semibold text-white">{result.interest_rate}% ({result.rate_type})</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-gray-400">Grace Period:</span>
                  <span className="font-semibold text-white">
                    {result.grace_period_type === 'NONE' ? 'None' : `${result.grace_period_months} months (${result.grace_period_type})`}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Payment Schedule</h2>
              <PaymentScheduleTable schedule={result.payment_schedule} />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default MortgageCalculatorPage;
