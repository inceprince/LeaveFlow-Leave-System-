import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import { 
  User, 
  ArrowLeft,
  Save,
  Key
} from 'lucide-react';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setFormData({
        name: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        department: parsedUser.department || ''
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      console.log('Updating profile with data:', formData);
      
      // Update user profile API call
      const response = await userService.updateProfile(formData);
      console.log('Profile update response:', response);
      
      // Update localStorage
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update profile';
      setMessage(errorMessage);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage('All password fields are required!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setMessage('New password must be at least 8 characters long!');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    
    setPasswordLoading(true);
    setMessage('');

    try {
      console.log('Updating password...');
      console.log('Password payload:', {
        currentPassword: passwordData.currentPassword ? '***' : 'MISSING',
        newPassword: passwordData.newPassword ? '***' : 'MISSING', 
        confirmPassword: passwordData.confirmPassword ? '***' : 'MISSING'
      });
      
      // Update password API call
      const response = await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      
      console.log('Password change response:', response);
      
      setMessage('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Password update error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to update password';
      setMessage(errorMessage);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-8 transition-colors duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Account Settings</h1>
              <p className="text-slate-500 dark:text-slate-400">Manage your profile and security</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'password'
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Key className="w-4 h-4" />
              Change Password
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              message.includes('success') 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
            }`}>
              {message}
            </div>
          )}

          {/* Tab Content */}
          {activeTab === 'profile' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Update Profile
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all"
                    required
                    minLength="8"
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Must be at least 8 characters long</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all"
                    required
                    minLength="6"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="flex-1 bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                  {passwordLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <Key className="w-5 h-5" />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
