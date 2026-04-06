import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import logo from '../assets/OIP.webp';
import { 
  Mail, 
  Eye, 
  EyeOff, 
  Shield
} from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(email, password);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      // Redirect based on role
      if (response.data.role === 'MANAGER') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex items-center justify-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <img src={logo} alt="LeaveFlow logo" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800" style={{ fontFamily: 'Poppins, sans-serif' }}>LeaveFlow</h1>
              <p className="text-xs text-slate-500" style={{ fontFamily: 'Poppins, sans-serif' }}>Smart employee leave management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Login 
              </h2>
              <p className="text-sm text-slate-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Sign in to explore the LeaveFlow experience
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Email Address
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-500 ${
                    focusedField === 'email' 
                      ? 'text-blue-500' 
                      : theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                  }`}>
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-500 ${
                      theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
                    }`}
                    placeholder="Enter your email"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-500 ${
                  theme === 'dark' ? 'text-slate-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-500 ${
                    focusedField === 'password' 
                      ? 'text-blue-500' 
                      : theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                  }`}>
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField('')}
                    className={`w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-500 ${
                      theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'
                    }`}
                    placeholder="Enter your password"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 pr-3 flex items-center transition-colors duration-500 ${
                      theme === 'dark' ? 'text-slate-400' : 'text-gray-400'
                    }`}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  <p className="text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-500 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-8 text-center space-y-4">
              <div className={`text-sm transition-colors duration-500 ${
                theme === 'dark' ? 'text-slate-400' : 'text-gray-600'
              }`}>
                Need an account?{' '}
                <Link 
                  to="/signup" 
                  className={`font-semibold transition-all duration-500 hover:underline ${
                    theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                  }`}
                >
                  Create Account
                </Link>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-xs">
                <div className={`h-px w-16 ${
                  theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'
                }`} />
                <span className={`transition-colors duration-500 ${
                  theme === 'dark' ? 'text-slate-500' : 'text-gray-400'
                }`}>
                  SECURE ACCESS
                </span>
                <div className={`h-px w-16 ${
                  theme === 'dark' ? 'bg-slate-600' : 'bg-gray-300'
                }`} />
              </div>
              
              <div className={`text-xs transition-colors duration-500 ${
                theme === 'dark' ? 'text-slate-500' : 'text-gray-400'
              }`}>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Shield className="w-4 h-4" />
                  <span>Automatic role detection</span>
                </div>
                <p>Managers and employees use the same login flow</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
