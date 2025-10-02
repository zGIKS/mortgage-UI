import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mortgageService } from '../api/mortgageService';
import PaymentScheduleTable from '../components/PaymentScheduleTable';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { Sidebar } from '../../shared/components/Sidebar';

const MortgageDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mortgage, setMortgage] = useState(null);
  const [loading, setLoading] = useState(true);
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
      setError(err?.message || 'Failed to fetch mortgage details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this calculation?')) {
      return;
    }

    try {
      await mortgageService.deleteMortgage(id);
      navigate('/mortgage/history');
    } catch (err) {
      alert('Failed to delete calculation: ' + (err?.message || 'Unknown error'));
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Sidebar />
        <Header />
        <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-4">
            <p className="text-red-400">{error}</p>
          </div>
          <Button onClick={() => navigate('/mortgage/history')}>
            Back to History
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
                ← Back
              </button>
            </div>
            <h1 className="text-3xl font-bold text-white">Mortgage Calculation #{mortgage.id}</h1>
            <p className="mt-2 text-gray-400">Created on {formatDate(mortgage.created_at)}</p>
          </div>
          <div className="mt-4 md:mt-0 flex gap-2">
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-800 rounded-lg transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Calculation Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Fixed Installment</p>
              <p className="text-2xl font-bold text-blue-400">{mortgage.currency} {formatCurrency(mortgage.fixed_installment)}</p>
            </div>

            <div className="bg-green-900/20 border border-green-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Principal Financed</p>
              <p className="text-2xl font-bold text-green-400">{mortgage.currency} {formatCurrency(mortgage.principal_financed)}</p>
            </div>

            <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Interest Paid</p>
              <p className="text-2xl font-bold text-purple-400">{mortgage.currency} {formatCurrency(mortgage.total_interest_paid)}</p>
            </div>

            <div className="bg-indigo-900/20 border border-indigo-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total Paid</p>
              <p className="text-2xl font-bold text-indigo-400">{mortgage.currency} {formatCurrency(mortgage.total_paid)}</p>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">TCEA</p>
              <p className="text-2xl font-bold text-yellow-400">{formatPercentage(mortgage.tcea)}%</p>
            </div>

            <div className="bg-pink-900/20 border border-pink-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Periodic Rate</p>
              <p className="text-2xl font-bold text-pink-400">{formatPercentage(mortgage.periodic_rate)}%</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">IRR</p>
              <p className="text-2xl font-bold text-gray-300">{formatPercentage(mortgage.irr)}%</p>
            </div>

            {mortgage.npv !== 0 && (
              <div className="bg-teal-900/20 border border-teal-800 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">NPV</p>
                <p className="text-2xl font-bold text-teal-400">{mortgage.currency} {formatCurrency(mortgage.npv)}</p>
              </div>
            )}

            <div className="bg-orange-900/20 border border-orange-800 rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Term</p>
              <p className="text-2xl font-bold text-orange-400">{mortgage.term_months} months</p>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Property Price:</span>
              <span className="font-semibold text-white">{mortgage.currency} {formatCurrency(mortgage.property_price)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Down Payment:</span>
              <span className="font-semibold text-white">{mortgage.currency} {formatCurrency(mortgage.down_payment)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Loan Amount:</span>
              <span className="font-semibold text-white">{mortgage.currency} {formatCurrency(mortgage.loan_amount)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Bono Techo Propio:</span>
              <span className="font-semibold text-white">{mortgage.currency} {formatCurrency(mortgage.bono_techo_propio)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Interest Rate:</span>
              <span className="font-semibold text-white">{mortgage.interest_rate}% ({mortgage.rate_type})</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-800">
              <span className="text-gray-400">Grace Period:</span>
              <span className="font-semibold text-white">
                {mortgage.grace_period_type === 'NONE' ? 'None' : `${mortgage.grace_period_months} months (${mortgage.grace_period_type})`}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Payment Schedule</h2>
          <PaymentScheduleTable schedule={mortgage.payment_schedule} />
        </div>
      </main>
    </div>
  );
};

export default MortgageDetailPage;
