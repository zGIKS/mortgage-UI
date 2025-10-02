import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../iam/application/auth-service';
import { Input } from '../shared/components/Input';
import { Button } from '../shared/components/Button';
import { Card } from '../shared/components/Card';
import { Header } from '../shared/components/Header';
import { Sidebar } from '../shared/components/Sidebar';

export function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentUser = authService.getUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setFormData({ email: currentUser.email, password: '' });
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await authService.updateProfile(
        formData.email !== user.email ? formData.email : null,
        formData.password || null
      );
      setUser(updatedUser);
      setSuccess('Profile updated successfully');
      setFormData({ ...formData, password: '' });
    } catch (err) {
      setError(err.message || 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <Header />

      <main className="lg:ml-64 px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>

        <div className="grid gap-6 max-w-4xl">
          <Card>
            <h2 className="text-xl font-semibold text-white mb-6">User Information</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-400">Full Name</span>
                <p className="text-gray-200 mt-1">{user.full_name}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Email</span>
                <p className="text-gray-200 mt-1">{user.email}</p>
              </div>
              <div>
                <span className="text-sm text-gray-400">Account Created</span>
                <p className="text-gray-200 mt-1">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-white mb-6">Update Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter new email"
              />

              <Input
                label="New Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Leave blank to keep current password"
              />

              {error && (
                <div className="bg-red-900/20 border border-red-900 text-red-400 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-900/20 border border-green-900 text-green-400 px-4 py-3 rounded-lg">
                  {success}
                </div>
              )}

              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
}
