import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mortgageService } from '../api/mortgageService';
import { Button } from '../../shared/components/Button';
import { Header } from '../../shared/components/Header';
import { Sidebar } from '../../shared/components/Sidebar';

const MortgageHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await mortgageService.getMortgageHistory(50, 0);
      setHistory(data);
    } catch (err) {
      setError(err?.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this calculation?')) {
      return;
    }

    try {
      await mortgageService.deleteMortgage(id);
      fetchHistory();
    } catch (err) {
      alert('Failed to delete calculation: ' + (err?.message || 'Unknown error'));
    }
  };

  const handleView = (id) => {
    navigate(`/mortgage/${id}`);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

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
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <Header />

      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Transactions</h1>
            <p className="mt-2 text-gray-400">View and manage your mortgage calculations</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button onClick={() => navigate('/mortgage/calculator')}>
              New Calculation
            </Button>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-400 mb-4">No mortgage calculations found</p>
            <Button onClick={() => navigate('/mortgage/calculator')}>
              Create Your First Calculation
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {history.map((item) => (
              <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Calculation #{item.id}
                      </h3>
                      <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800">
                        {item.currency}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Property Price</p>
                        <p className="font-semibold text-white">{item.currency} {formatCurrency(item.property_price)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Loan Amount</p>
                        <p className="font-semibold text-white">{item.currency} {formatCurrency(item.loan_amount)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Term</p>
                        <p className="font-semibold text-white">{item.term_months} months</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Fixed Installment</p>
                        <p className="font-semibold text-white">{item.currency} {formatCurrency(item.fixed_installment)}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">TCEA</p>
                        <p className="font-semibold text-white">{formatPercentage(item.tcea)}%</p>
                      </div>
                      <div className="col-span-2 md:col-span-3">
                        <p className="text-gray-400">Created</p>
                        <p className="font-semibold text-white">{formatDate(item.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-row lg:flex-col gap-2">
                    <Button
                      onClick={() => handleView(item.id)}
                      className="flex-1 lg:flex-none"
                    >
                      View Details
                    </Button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 lg:flex-none px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 border border-red-800 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MortgageHistoryPage;
