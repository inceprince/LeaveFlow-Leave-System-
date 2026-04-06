import React, { useState, useEffect } from 'react';
import 'react-calendar/dist/Calendar.css';
import { userService } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import EnhancedCalendar from '../components/EnhancedCalendar';
import { useRealTimeLeaves } from '../hooks/useRealTimeLeaves';
import logo from '../assets/OIP.webp';
import { 
  Calendar as CalendarIcon, 
  LogOut, 
  Plus, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Clock3,
  User,
  FileText,
  CalendarDays,
  RefreshCw,
  ChevronDown,
  Tag
} from 'lucide-react';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('apply');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [leaveType, setLeaveType] = useState('casual');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [duration, setDuration] = useState(0);
  const [halfDaySession, setHalfDaySession] = useState('');
  
  // Use simple real-time leaves hook
  const { leaves, loading, refetch } = useRealTimeLeaves();

  // Generate blocked dates array
  const blockedDates = leaves
    .filter((leave) => leave.status !== "REJECTED")
    .flatMap((leave) => {
      const dates = [];
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d).toISOString().split("T")[0]);
      }

      return dates;
    });

  // Helper function
  const isBlocked = (dateString) => {
    return blockedDates.includes(dateString);
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Calculate duration when dates change
  useEffect(() => {
    if (leaveType === 'HALF_DAY' && startDate) {
      setDuration(0.5);
      return;
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      setDuration(days > 0 ? days : 0);
    } else {
      setDuration(0);
    }
  }, [startDate, endDate, leaveType]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showAccountMenu && !event.target.closest('.account-menu-container')) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAccountMenu]);

  // Handle half-day logic
  useEffect(() => {
    if (leaveType === 'HALF_DAY') {
      setEndDate(startDate || '');
    } else {
      setHalfDaySession('');
    }
  }, [leaveType, startDate]);

  // Overlap validation function
  const isDateOverlap = () => {
    if (!startDate || !endDate) return false;

    const newStart = new Date(startDate);
    const newEnd = new Date(endDate);

    return leaves.some((leave) => {
      // Ignore rejected leaves
      if (leave.status === "REJECTED") return false;

      const existingStart = new Date(leave.startDate);
      const existingEnd = new Date(leave.endDate);

      const overlap =
        newStart <= existingEnd &&
        newEnd >= existingStart;

      if (!overlap) return false;

      // Special case for half-day logic
      if (
        leave.leaveType === "HALF_DAY" &&
        leave.startDate === startDate
      ) {
        // Allow opposite session
        if (leave.session !== halfDaySession) {
          return false;
        }
      }

      return true;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setMessage('');

    try {
      console.log('=== SUBMIT DEBUG ===');
      console.log('Submitting leave application:', { startDate, endDate, reason, leaveType });
      console.log('Token in localStorage:', localStorage.getItem('token') ? 'EXISTS' : 'MISSING');
      console.log('Half day session state:', halfDaySession);
      console.log('Form state:', {
        startDate,
        endDate,
        reason,
        leaveType,
        halfDaySession,
        submitLoading
      });
      
      // Validate half-day session
      if (leaveType === 'HALF_DAY' && !halfDaySession) {
        console.log('HALF_DAY selected but no session:', { leaveType, halfDaySession });
        setMessage('Please select First Half or Second Half');
        setSubmitLoading(false);
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      
      console.log('Session validation passed:', { leaveType, halfDaySession });
      
      // Keep overlap check before submit
      if (isDateOverlap()) {
        setMessage("You already applied leave for selected date(s).");
        setSubmitLoading(false);
        setTimeout(() => setMessage(''), 3000);
        return;
      }
      
      const leavePayload = {
        startDate,
        endDate,
        reason,
        leaveType: leaveType === 'HALF_DAY' ? 'HALF_DAY' : leaveType.toUpperCase(),
        status: 'PENDING',
        session: leaveType === 'HALF_DAY' ? halfDaySession : null
      };
      
      console.log('Leave payload being sent:', leavePayload);
      console.log('Leave type being sent:', leavePayload.leaveType);
      console.log('Session being sent:', leavePayload.session);
      
      const response = await userService.applyLeave(leavePayload);
      
      console.log('Leave application response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      console.log('Leave type in response:', response.data?.leaveType);
      
      // Check if the response is actually successful
      if (response.status >= 200 && response.status < 300) {
        setMessage('Leave application submitted successfully!');
        setStartDate('');
        setEndDate('');
        setReason('');
        setLeaveType('casual');
        setHalfDaySession('');
        refetch();
        
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to submit leave application');
        setTimeout(() => setMessage(''), 5000);
      }
      
    } catch (error) {
      console.error('Error submitting leave:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      if (error.response?.status === 403) {
        setMessage('Authentication failed. Please log in again.');
        // Optionally redirect to login
        // window.location.href = '/login';
      } else {
        // Show actual error message from backend
        setMessage(error.response?.data?.message || 'Failed to submit leave application');
      }
      
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleProfileUpdate = () => {
    // Navigate to profile update page or open modal
    window.location.href = '/profile';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'REJECTED':
        return 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-4 h-4" />
            Accepted
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-rose-100 dark:bg-rose-900/50 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-4 h-4" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800">
            <Clock3 className="w-4 h-4" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="bg-white dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-50 transition-all duration-300">
        {/* Desktop Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 hidden sm:block">
          <div className="flex items-center justify-between h-16 gap-2 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <img src={logo} alt="LeaveFlow logo" className="w-7 h-7 object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Poppins, sans-serif' }}>LeaveFlow</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400" style={{ fontFamily: 'Poppins, sans-serif' }}>Employee Portal</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="relative account-menu-container">
                <div className="flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-700 rounded-full transition-colors duration-300 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-600"
                     onClick={() => setShowAccountMenu(!showAccountMenu)}>
                  <div className="w-8 h-8 bg-gradient-to-br from-[#264CFC] to-[#1a3ba8] rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name || 'Employee'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px] sm:max-w-none">{user?.email || 'employee@company.com'}</p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                </div>
                
                {showAccountMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50">
                    <div className="p-2">
                      <button
                        onClick={handleProfileUpdate}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Update Profile
                      </button>
                      <div className="border-t border-slate-200 dark:border-slate-600 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden">
          <div className="flex items-center justify-between h-14 px-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <img src={logo} alt="LeaveFlow logo" className="w-6 h-6 object-contain" />
              </div>
              <h1 className="text-lg font-bold text-slate-800 dark:text-slate-100" style={{ fontFamily: 'Poppins, sans-serif' }}>LeaveFlow</h1>
            </div>
            <div className="relative account-menu-container">
              <div className="w-8 h-8 bg-gradient-to-br from-[#264CFC] to-[#1a3ba8] rounded-full flex items-center justify-center cursor-pointer"
                   onClick={() => setShowAccountMenu(!showAccountMenu)}>
                <User className="w-4 h-4 text-white" />
              </div>
              
              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50">
                  <div className="p-2">
                    <button
                      onClick={handleProfileUpdate}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </button>
                    <div className="border-t border-slate-200 dark:border-slate-600 my-2"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 sm:pb-8">
        {/* Desktop Stats - Hidden on Mobile */}
        <div className="hidden sm:grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Total Leaves</p>
                <p className="text-lg sm:text-2xl font-bold text-slate-800 dark:text-slate-100">{leaves.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Accepted</p>
                <p className="text-lg sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{leaves.filter(l => l.status === 'APPROVED').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-rose-100 dark:bg-rose-900/50 rounded-lg flex items-center justify-center">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Rejected</p>
                <p className="text-lg sm:text-2xl font-bold text-rose-600 dark:text-rose-400">{leaves.filter(l => l.status === 'REJECTED').length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
                <Clock3 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Pending</p>
                <p className="text-lg sm:text-2xl font-bold text-amber-600 dark:text-amber-400">{leaves.filter(l => l.status === 'PENDING').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stats - Horizontal Scroll */}
        <div className="sm:hidden flex gap-3 overflow-x-auto pb-2 mb-8">
          <div className="min-w-[160px] bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">{leaves.length}</p>
              </div>
            </div>
          </div>
          <div className="min-w-[160px] bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Accepted</p>
                <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{leaves.filter(l => l.status === 'APPROVED').length}</p>
              </div>
            </div>
          </div>
          <div className="min-w-[160px] bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-rose-100 dark:bg-rose-900/50 rounded-lg flex items-center justify-center">
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Rejected</p>
                <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{leaves.filter(l => l.status === 'REJECTED').length}</p>
              </div>
            </div>
          </div>
          <div className="min-w-[160px] bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 border border-slate-200 dark:border-slate-700 transition-colors duration-300">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
                <Clock3 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pending</p>
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{leaves.filter(l => l.status === 'PENDING').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area with Smooth Transitions */}
        <div className="transition-all duration-300 ease-in-out">
          {/* Desktop Layout */}
          <div className="hidden sm:block">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Leave Application Form */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5 sm:p-8 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">New Leave Application</h3>
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

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Leave Type</label>
                    <select
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all"
                      required
                    >
                      <option value="casual">Casual Leave</option>
                      <option value="privilege">Privilege Leave</option>
                      <option value="HALF_DAY">Half Day Leave</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Start Date</label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (isBlocked(value)) {
                            setMessage("Leave already exists for this date.");
                            setTimeout(() => setMessage(""), 2500);
                            setStartDate("");  // Reset invalid selection
                            return;
                          }

                          setMessage("");
                          setStartDate(value);
                        }}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">End Date</label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (isBlocked(value)) {
                            setMessage("Leave already exists for this date.");
                            setTimeout(() => setMessage(""), 2500);
                            setEndDate("");  // Reset invalid selection
                            return;
                          }

                          setMessage("");
                          setEndDate(value);
                        }}
                        min={startDate}
                        disabled={leaveType === 'HALF_DAY'}
                        className={`w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                          leaveType === 'HALF_DAY' 
                            ? 'bg-slate-100 dark:bg-slate-600 cursor-not-allowed opacity-60' 
                            : 'bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  {/* Duration Display */}
                  {duration > 0 && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                          {duration === 0.5 ? 'Half Day' : `${duration} day${duration === 1 ? '' : 's'}`}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Half Day Session Selection */}
                  {leaveType === 'HALF_DAY' && (
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Session</label>
                      <select
                        value={halfDaySession}
                        onChange={(e) => setHalfDaySession(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all"
                        required
                      >
                        <option value="">Select Session</option>
                        <option value="FIRST_HALF">First Half (Morning)</option>
                        <option value="SECOND_HALF">Second Half (Afternoon)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Reason for Leave</label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      rows="4"
                      className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all resize-none"
                      placeholder="Please describe your reason for taking leave..."
                      required
                    />
                  </div>

                  <div className="sticky bottom-0 bg-white dark:bg-slate-800 pt-4 pb-2 -mx-5 sm:-mx-8 px-5 sm:px-8">
                    <button
                      type="submit"
                      disabled={submitLoading}
                      className="w-full bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-semibold py-3.5 sm:py-4 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                    >
                      {submitLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Submitting...
                        </>
                      ) : (
                        <><Plus className="w-5 h-5" /> Submit Application</>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Enhanced Calendar */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8 transition-colors duration-300">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                    <CalendarIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    Leave Calendar
                  </h3>
                </div>

                <div className="calendar-wrapper rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                  <EnhancedCalendar leaves={leaves} />
                </div>

                {/* Clean Professional Legend */}
                <div className="mt-6 bg-slate-50 dark:bg-slate-700 p-4 rounded-xl transition-colors duration-300">
                  <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                    Leave Status
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-slate-600 dark:text-slate-300">
                        Approved
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-slate-600 dark:text-slate-300">
                        Pending
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-slate-600 dark:text-slate-300">
                        Rejected
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {/* Leave History */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5 sm:p-8 transition-colors duration-300">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Leave History</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Track all your leave applications</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={refetch}
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                      title="Manual refresh"
                    >
                      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                </div>
                
                {loading ? (
                  <div className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                    <p className="mt-4 text-slate-600 dark:text-slate-300 font-medium">Loading your leaves...</p>
                  </div>
                ) : leaves.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-600 border-dashed transition-colors duration-300">
                    <div className="w-20 h-20 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarDays className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">No leave applications yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Start by applying for your first leave. Your applications will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:space-y-0">
                    {leaves.map((leave) => (
                      <div key={leave.id} className={`rounded-2xl border-2 p-4 sm:p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${getStatusColor(leave.status)}`}>
                        <div className="flex items-start justify-between mb-4">
                          {getStatusBadge(leave.status)}
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-700/70 px-2 py-1 rounded-lg">
                            #{leave.id}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                              {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Tag className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-700/60 rounded-lg px-2 py-1">
                              {leave.leaveType ? leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1).toLowerCase() : 'Casual'}
                            </span>
                          </div>
                          
                          <div className="text-xs text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-700/60 rounded-lg p-3 line-clamp-2 break-words">
                            {leave.reason || 'No reason provided'}
                          </div>
                          
                          {/* Manager Comment for Approved/Rejected */}
                          {leave.status !== 'PENDING' && leave.managerComment && (
                            <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-600">
                              <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Manager Comment</div>
                              <div className="text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 border border-slate-200 dark:border-slate-600 break-words">
                                {leave.managerComment}
                              </div>
                            </div>
                          )}
                          
                          <div className="pt-3 border-t border-slate-200/50 dark:border-slate-600 flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">
                              {Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                            </span>
                            <span className="text-slate-400 dark:text-slate-400">
                              {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="sm:hidden">
            {activeTab === 'apply' ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Leave Application Form */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5 sm:p-8 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">New Leave Application</h3>
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

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Leave Type</label>
                      <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all"
                        required
                      >
                        <option value="casual">Casual Leave</option>
                        <option value="privilege">Privilege Leave</option>
                        <option value="HALF_DAY">Half Day Leave</option>
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Start Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            const value = e.target.value;

                            if (isBlocked(value)) {
                              setMessage("Leave already exists for this date.");
                              setTimeout(() => setMessage(""), 2500);
                              setStartDate("");  // Reset invalid selection
                              return;
                            }

                            setMessage("");
                            setStartDate(value);
                          }}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">End Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            const value = e.target.value;

                            if (isBlocked(value)) {
                              setMessage("Leave already exists for this date.");
                              setTimeout(() => setMessage(""), 2500);
                              setEndDate("");  // Reset invalid selection
                              return;
                            }

                            setMessage("");
                            setEndDate(value);
                          }}
                          min={startDate}
                          disabled={leaveType === 'HALF_DAY'}
                          className={`w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                            leaveType === 'HALF_DAY' 
                              ? 'bg-slate-100 dark:bg-slate-600 cursor-not-allowed opacity-60' 
                              : 'bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100'
                          }`}
                          required
                        />
                      </div>
                    </div>

                    {/* Duration Display */}
                    {duration > 0 && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                            {duration === 0.5 ? 'Half Day' : `${duration} day${duration === 1 ? '' : 's'}`}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Half Day Session Selection */}
                    {leaveType === 'HALF_DAY' && (
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Select Session</label>
                        <select
                          value={halfDaySession}
                          onChange={(e) => setHalfDaySession(e.target.value)}
                          className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all"
                          required
                        >
                          <option value="">Select Session</option>
                          <option value="FIRST_HALF">First Half (Morning)</option>
                          <option value="SECOND_HALF">Second Half (Afternoon)</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Reason for Leave</label>
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows="4"
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-100 transition-all resize-none"
                        placeholder="Please describe your reason for taking leave..."
                        required
                      />
                    </div>

                    <div className="sticky bottom-0 bg-white dark:bg-slate-800 pt-4 pb-2 -mx-5 sm:-mx-8 px-5 sm:px-8">
                      <button
                        type="submit"
                        disabled={submitLoading}
                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-700 hover:from-indigo-700 hover:to-violet-800 text-white font-semibold py-3.5 sm:py-4 rounded-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                      >
                        {submitLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Submitting...
                          </>
                        ) : (
                          <><Plus className="w-5 h-5" /> Submit Application</>
                        )}
                      </button>
                    </div>
                  </form>
                </div>

                {/* Enhanced Calendar */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 sm:p-8 transition-colors duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <CalendarIcon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                      Leave Calendar
                    </h3>
                  </div>

                  <div className="calendar-wrapper rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    <EnhancedCalendar leaves={leaves} />
                  </div>

                  {/* Clean Professional Legend */}
                  <div className="mt-6 bg-slate-50 dark:bg-slate-700 p-4 rounded-xl transition-colors duration-300">
                    <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">
                      Leave Status
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                        <span className="text-slate-600 dark:text-slate-300">
                          Approved
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-slate-600 dark:text-slate-300">
                          Pending
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <span className="text-slate-600 dark:text-slate-300">
                          Rejected
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 p-5 sm:p-8 transition-colors duration-300">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Leave History</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Track all your leave applications</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refetch}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                  title="Manual refresh"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
                <p className="mt-4 text-slate-600 dark:text-slate-300 font-medium">Loading your leaves...</p>
              </div>
            ) : leaves.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-700/50 rounded-2xl border border-slate-200 dark:border-slate-600 border-dashed transition-colors duration-300">
                <div className="w-20 h-20 bg-slate-200 dark:bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CalendarDays className="w-10 h-10 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">No leave applications yet</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Start by applying for your first leave. Your applications will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-5 md:space-y-0">
                {leaves.map((leave) => (
                  <div key={leave.id} className={`rounded-2xl border-2 p-4 sm:p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${getStatusColor(leave.status)}`}>
                    <div className="flex items-start justify-between mb-4">
                      {getStatusBadge(leave.status)}
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-700/70 px-2 py-1 rounded-lg">
                        #{leave.id}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(leave.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-700/60 rounded-lg px-2 py-1">
                          {leave.leaveType ? leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1).toLowerCase() : 'Casual'}
                        </span>
                      </div>
                      
                      <div className="text-xs text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-700/60 rounded-lg p-3 line-clamp-2 break-words">
                        {leave.reason || 'No reason provided'}
                      </div>
                      
                      {/* Manager Comment for Approved/Rejected */}
                      {leave.status !== 'PENDING' && leave.managerComment && (
                        <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-600">
                          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Manager Comment</div>
                          <div className="text-sm text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 border border-slate-200 dark:border-slate-600 break-words">
                            {leave.managerComment}
                          </div>
                        </div>
                      )}
                      
                      <div className="pt-3 border-t border-slate-200/50 dark:border-slate-600 flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          {Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                        </span>
                        <span className="text-slate-400 dark:text-slate-400">
                          {new Date(leave.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-lg z-50">
        <div className="flex justify-around items-center py-2">
          <button
            onClick={() => setActiveTab('apply')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'apply'
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-medium">Apply</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition-all ${
              activeTab === 'history'
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            <span className="text-xs font-medium">History</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
