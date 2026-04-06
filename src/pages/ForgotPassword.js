import React, { useState } from 'react';
import { userService } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import logo from '../assets/OIP.webp';
import { 
  Key, 
  ArrowLeft,
  Mail,
  CheckCircle
} from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await userService.forgotPassword(email);
      setEmailSent(true);
      setMessage('Password reset instructions have been sent to your email address.');
      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      setMessage('Failed to send reset instructions: ' + (error.response?.data?.message || error.message));
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 flex items-center justify-center">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Login
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <div className="w-9 h-9 bg-white dark:bg-slate-700 rounded-lg flex items-center justify-center shadow-sm">
                  <img src={logo} alt="LeaveFlow logo" className="w-6 h-6 object-contain" />
                </div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">LeaveFlow</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Account recovery</div>
                </div>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-md w-full mx-auto px-4 pt-24">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 transition-colors duration-300">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2">
              {emailSent ? 'Check Your Email' : 'Forgot Password?'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {emailSent 
                ? 'We\'ve sent password reset instructions to your email.'
                : 'Enter your email address and LeaveFlow will send password reset instructions.'
              }
            </p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              message.includes('sent') 
                ? 'bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
            }`}>
              {message}
            </div>
          )}

          {!emailSent ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all"
                    placeholder="Enter your email address"
                    required
                  />
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Reset Instructions
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Please check your email and follow the instructions to reset your password.
              </p>
              <button
                onClick={handleBack}
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
