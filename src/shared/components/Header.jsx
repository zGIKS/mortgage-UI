import { useNavigate } from 'react-router-dom';
import { authService } from '../../iam/application/auth-service';
import { Button } from './Button';

export function Header() {
  const navigate = useNavigate();
  const user = authService.getUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-900 border-b border-gray-800 lg:ml-64 sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4 ml-14 lg:ml-0">
            <span className="text-gray-400">Hello, {user?.full_name}</span>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
