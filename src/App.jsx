import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './iam/presentation/pages/LoginPage';
import { RegisterPage } from './iam/presentation/pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';
import MortgageCalculatorPage from './mortgage/pages/MortgageCalculatorPage';
import MortgageHistoryPage from './mortgage/pages/MortgageHistoryPage';
import MortgageDetailPage from './mortgage/pages/MortgageDetailPage';
import { authService } from './iam/application/auth-service';
import { Toaster } from '@/components/ui/sonner';

function PrivateRoute({ children }) {
  return authService.isAuthenticated() ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/mortgage/calculator"
          element={
            <PrivateRoute>
              <MortgageCalculatorPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/mortgage/history"
          element={
            <PrivateRoute>
              <MortgageHistoryPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/mortgage/:id"
          element={
            <PrivateRoute>
              <MortgageDetailPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
