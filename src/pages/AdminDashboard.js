import React, { useState, useEffect, useCallback } from 'react';
import { userService, managerService } from '../services/api';
import logo from '../assets/OIP.webp';
import { 
  RefreshCw, 
  Menu, 
  CheckCircle, 
  User, 
  Calendar, 
  Clock, 
  XCircle, 
  ChevronDown,
  X,
  LogOut,
  Key
} from 'lucide-react';

// Reusable helper function to safely extract arrays from different API response structures
const extractArray = (responseData) => {
  if (!responseData) return [];
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData.data)) return responseData.data;
  if (Array.isArray(responseData.content)) return responseData.content;
  if (Array.isArray(responseData.leaves)) return responseData.leaves;
  if (Array.isArray(responseData.users)) return responseData.users;
  return [];
};

// UsersTable Component
const UsersTable = ({ users, handleUserClick, searchTerm, setSearchTerm }) => {
  // Filter users by name
  const filteredUsers = users.filter(user => 
    user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
      {/* Search Bar */}
      <div className="p-4 border-b border-slate-200">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-4 w-4 text-slate-400" />
          </div>
        </div>
      </div>
      
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="px-8 py-5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
              <th className="px-8 py-5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
              <th className="px-8 py-5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">History</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredUsers.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mr-3 border border-slate-200">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <div className="text-sm font-medium text-slate-900">{u.name || 'N/A'}</div>
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm text-slate-700">{u.email || '-'}</div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <button
                    onClick={() => handleUserClick(u)}
                    className="px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden p-4 space-y-4">
        {filteredUsers.map((u) => (
          <div key={u.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                <User className="w-5 h-5 text-slate-600" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 truncate">{u.name || 'N/A'}</div>
                <div className="text-xs text-slate-500 truncate">{u.email || '-'}</div>
              </div>
            </div>

            <button
              onClick={() => handleUserClick(u)}
              className="w-full px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
            >
              View History
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  activeSection, 
  menuItems, 
  handleSectionChange, 
  user, 
  handleLogout,
  leaves,
  users,
  setShowPasswordModal
}) => {
  return (
    <aside className={`fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-slate-200 shadow-sm flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:relative lg:flex lg:flex-col ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200">
              <img src={logo} alt="LeaveFlow logo" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900" style={{ fontFamily: 'Poppins, sans-serif' }}>LeaveFlow</h1>
              <p className="text-xs text-slate-500" style={{ fontFamily: 'Poppins, sans-serif' }}>Manager Portal</p>
            </div>
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  handleSectionChange(item.id);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : ''}`} />
                  <span className={`text-sm font-medium ${isActive ? 'text-indigo-700' : ''}`} style={{ fontFamily: 'Poppins, sans-serif' }}>{item.label}</span>
                </div>
                {item.count !== undefined && (
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                    isActive 
                      ? 'bg-indigo-100 text-indigo-700' 
                      : 'bg-slate-100 text-slate-600'
                  }`} style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>


      {/* User Profile Section */}
      <div className="mt-auto p-3 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-slate-200">
            <User className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {user?.name || 'Manager'}
            </p>
            <p className="text-xs text-slate-500 truncate" style={{ fontFamily: 'Poppins, sans-serif' }}>
              {user?.email || 'manager@company.com'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors border border-indigo-200 mb-2"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <Key className="w-4 h-4" />
          Change Password
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 bg-white rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

// LeaveTable Component
const LeaveTable = ({ 
  leaves, 
  activeSection, 
  handleStatusChange, 
  actionLoading, 
  handleUserClick 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-slate-200">
      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
            <tr>
              <th className="px-8 py-5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employee</th>
              <th className="px-8 py-5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Leave Period</th>
              <th className="px-8 py-5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</th>
              <th className="px-8 py-5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
              <th className="px-8 py-5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
              <th className="px-8 py-5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              {activeSection === 'pending' && (
                <th className="px-8 py-5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {leaves && leaves.map((leave) => (
              <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mr-3 border border-slate-200">
                      <User className="w-4 h-4 text-slate-600" />
                    </div>
                    <button
                      onClick={() => handleUserClick(leave.user)}
                      className="text-sm font-medium text-slate-900 hover:text-indigo-600 transition-colors"
                    >
                      {leave.user?.name || 'Employee'}
                    </button>
                  </div>
                  <div className="text-xs text-slate-500">{leave.user?.email || 'employee@company.com'}</div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="text-sm text-slate-900">
                    {new Date(leave.startDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                  <div className="text-xs text-slate-500">to</div>
                  <div className="text-sm text-slate-900">
                    {new Date(leave.endDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center text-sm text-slate-900">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    {leave.leaveType === 'HALF_DAY' ? '0.5 days' : 
                     `${Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1} days`}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {leave.leaveType === 'HALF_DAY' ? 'Half Day' : 
                       leave.leaveType ? leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1).toLowerCase() : 'Casual'}
                    </span>
                    {leave.leaveType === 'HALF_DAY' && leave.session && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {leave.session === 'FIRST_HALF' ? 'First Half' : 'Second Half'}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="text-sm text-slate-900 max-w-xs truncate" title={leave.reason}>
                    {leave.reason || 'No reason provided'}
                  </div>
                </td>
                <td className="px-8 py-5 whitespace-nowrap">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    leave.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                    leave.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {leave.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                    {leave.status === 'APPROVED' && <CheckCircle className="w-3 h-3 mr-1" />}
                    {leave.status === 'REJECTED' && <XCircle className="w-3 h-3 mr-1" />}
                    {leave.status}
                  </span>
                </td>
                {activeSection === 'pending' && leave.status === 'PENDING' && (
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="relative">
                      <select
                        onChange={(e) => handleStatusChange(leave.id, e.target.value)}
                        defaultValue=""
                        className="appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        disabled={actionLoading[leave.id]}
                      >
                        <option value="" disabled>Select Action</option>
                        <option value="approve">Approve</option>
                        <option value="reject">Reject</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </td>
                )}
                {activeSection === 'pending' && leave.status !== 'PENDING' && (
                  <td className="px-8 py-5 whitespace-nowrap">
                    <span className="text-slate-400 text-sm">No actions available</span>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden p-4 space-y-4">
        {leaves && leaves.map((leave) => (
          <div key={leave.id} className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
            {/* Employee Info */}
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mr-3 border border-slate-200">
                <User className="w-5 h-5 text-slate-600" />
              </div>
              <div className="flex-1">
                <button
                  onClick={() => handleUserClick(leave.user)}
                  className="text-sm font-medium text-slate-900 hover:text-indigo-600 transition-colors"
                >
                  {leave.user?.name || 'Employee'}
                </button>
                <div className="text-xs text-slate-500">{leave.user?.email || 'employee@company.com'}</div>
              </div>
              {/* Status Badge */}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                leave.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                leave.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                'bg-rose-100 text-rose-800'
              }`}>
                {leave.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                {leave.status === 'APPROVED' && <CheckCircle className="w-3 h-3 mr-1" />}
                {leave.status === 'REJECTED' && <XCircle className="w-3 h-3 mr-1" />}
                {leave.status}
              </span>
            </div>

            {/* Leave Period */}
            <div className="mb-3">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Leave Period</div>
              <div className="text-sm text-slate-900">
                {new Date(leave.startDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })} - {new Date(leave.endDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </div>
            </div>

            {/* Duration and Type */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Duration</div>
                <div className="flex items-center text-sm text-slate-900">
                  <Calendar className="w-4 h-4 mr-1 text-slate-400" />
                  {leave.leaveType === 'HALF_DAY' ? '0.5 days' : 
                   `${Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1} days`}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Type</div>
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {leave.leaveType === 'HALF_DAY' ? 'Half Day' : 
                     leave.leaveType ? leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1).toLowerCase() : 'Casual'}
                  </span>
                  {leave.leaveType === 'HALF_DAY' && leave.session && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {leave.session === 'FIRST_HALF' ? 'First Half' : 'Second Half'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Reason */}
            <div className="mb-3">
              <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Reason</div>
              <div className="text-sm text-slate-900">
                {leave.reason || 'No reason provided'}
              </div>
            </div>

            {/* Action Buttons for Pending */}
            {activeSection === 'pending' && leave.status === 'PENDING' && (
              <div className="pt-3 border-t border-slate-200">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Action</div>
                <div className="relative">
                  <select
                    onChange={(e) => handleStatusChange(leave.id, e.target.value)}
                    defaultValue=""
                    className="w-full appearance-none bg-white border border-slate-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    disabled={actionLoading[leave.id]}
                  >
                    <option value="" disabled>Select Action</option>
                    <option value="approve">Approve</option>
                    <option value="reject">Reject</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// UserModal Component
const UserModal = ({ 
  showUserModal, 
  setShowUserModal, 
  selectedUser, 
  userLeaves 
}) => {
  if (!showUserModal || !selectedUser) return null;

  const totalDays = userLeaves.reduce((total, leave) => {
    const days = Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1;
    return total + days;
  }, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md md:max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="p-4 md:p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">
              {selectedUser.name}'s Leave History
            </h3>
            <button
              onClick={() => setShowUserModal(false)}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6">
          {/* Employee Information */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1">
                <div className="text-sm text-slate-600">
                  <strong>Employee:</strong> {selectedUser.name}
                </div>
                <div className="text-sm text-slate-600">
                  <strong>Email:</strong> {selectedUser.email}
                </div>
              </div>
              <div className="text-sm text-slate-600">
                <strong>Total Leave Days:</strong> {totalDays} days
              </div>
            </div>
          </div>

          {/* Leave History Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Period</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {userLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {new Date(leave.startDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })} - {new Date(leave.endDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      {leave.leaveType === 'HALF_DAY' ? '0.5 days' : 
                       `${Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1} days`}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {leave.leaveType === 'HALF_DAY' ? 'Half Day' : 
                           leave.leaveType ? leave.leaveType.charAt(0).toUpperCase() + leave.leaveType.slice(1).toLowerCase() : 'Casual'}
                        </span>
                        {leave.leaveType === 'HALF_DAY' && leave.session && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {leave.session === 'FIRST_HALF' ? 'First Half' : 'Second Half'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900 max-w-xs truncate" title={leave.reason}>
                      {leave.reason || 'No reason provided'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        leave.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        leave.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {leave.status === 'PENDING' && <Clock className="w-3 h-3 mr-1" />}
                        {leave.status === 'APPROVED' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {userLeaves.length === 0 && (
            <div className="text-center py-12">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm">
                No leave requests found for this employee.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// CommentPopup Component
const CommentPopup = ({ 
  commentPopup, 
  setCommentPopup, 
  handleActionSubmit, 
  actionLoading 
}) => {
  if (!commentPopup.open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {commentPopup.action === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
        </h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {commentPopup.action === 'approve' ? 'Optional Comment' : 'Reason for rejection'}
          </label>
          <textarea
            value={commentPopup.comment}
            onChange={(e) => setCommentPopup({ ...commentPopup, comment: e.target.value })}
            placeholder={commentPopup.action === 'approve' ? 'Add any comments (optional)' : 'Reason for rejection...'}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setCommentPopup({ open: false, leaveId: null, action: null, comment: '' })}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleActionSubmit}
            disabled={actionLoading[commentPopup.leaveId]}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
              commentPopup.action === 'approve'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {actionLoading[commentPopup.leaveId] ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing...
              </div>
            ) : (
              commentPopup.action === 'approve' ? 'Approve' : 'Reject'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Main AdminDashboard Component
const AdminDashboard = () => {
  const [leaves, setLeaves] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('pending');
  const [commentPopup, setCommentPopup] = useState({ open: false, leaveId: null, action: null, comment: '' });
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    userName: '',
    leaveType: '',
    status: '',
    month: '',
    year: ''
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userLeaves, setUserLeaves] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  // Direct state management for refresh functionality
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [updateMessage, setUpdateMessage] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const showUpdateMessage = useCallback((message) => {
    setUpdateMessage(message);
    setTimeout(() => setUpdateMessage(''), 3000);
  }, []);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (activeSection === 'pending') {
        await fetchPendingLeaves();
        showUpdateMessage('Pending requests updated');
      } else if (activeSection === 'all') {
        await fetchAllLeaves();
        showUpdateMessage('All leaves updated');
      } else if (activeSection === 'users') {
        await fetchAllUsers();
        showUpdateMessage('User list updated');
      }
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error refreshing data:', error);
      showUpdateMessage('Error updating data');
    } finally {
      setIsRefreshing(false);
    }
  }, [activeSection, filters, showUpdateMessage]);

  // Initial data fetch on component mount
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Menu items
  const menuItems = [
    { id: 'pending', label: 'Pending Requests', icon: CheckCircle, count: leaves.filter(l => l.status === 'PENDING').length },
    { id: 'all', label: 'All Leaves', icon: RefreshCw, count: leaves.length },
    { id: 'users', label: 'Users', icon: User, count: users.length },
  ];

  useEffect(() => {
    if (activeSection === 'pending') fetchPendingLeaves();
    if (activeSection === 'all') fetchAllLeaves();
    if (activeSection === 'users') fetchAllUsers();
  }, [activeSection]);


  async function fetchPendingLeaves() {
    setLoading(true);
    try {
      const pendingParams = {};

      if (filters.userName && filters.userName.trim() !== '') {
        pendingParams.userName = filters.userName.trim();
      }
      if (filters.leaveType && filters.leaveType.trim() !== '') {
        pendingParams.leaveType = filters.leaveType.trim();
      }
      if (filters.month && filters.month !== '') {
        pendingParams.month = filters.month;
      }
      if (filters.year && filters.year !== '') {
        pendingParams.year = filters.year;
      }

      const hasPendingFilters = Object.keys(pendingParams).length > 0;
      const response = hasPendingFilters
        ? await managerService.filterLeavesEnhanced({ ...pendingParams, status: 'PENDING' })
        : await managerService.getPendingLeaves();
      
      // Safe array extraction using helper function
      const leavesArray = extractArray(response.data);
      
      // Sort by newest first (most recent at top) using spread operator to avoid mutation
      const sortedLeaves = [...leavesArray].sort((a, b) => {
        const dateA = new Date(a.startDate || a.createdAt || 0);
        const dateB = new Date(b.startDate || b.createdAt || 0);
        return dateB - dateA; // Newest first (descending)
      });
      
      setLeaves(sortedLeaves);
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAllLeaves() {
    setLoading(true);
    try {
      console.log('Fetching leaves with enhanced filters:', filters);
      const params = {};
      
      // Only add non-empty parameters
      if (filters.userName && filters.userName.trim() !== '') {
        params.userName = filters.userName.trim();
      }
      if (filters.leaveType && filters.leaveType.trim() !== '') {
        params.leaveType = filters.leaveType.trim();
      }
      if (filters.status && filters.status.trim() !== '') {
        params.status = filters.status.trim();
      }
      if (filters.startDate && filters.startDate.trim() !== '') {
        params.startDate = filters.startDate.trim();
      }
      if (filters.endDate && filters.endDate.trim() !== '') {
        params.endDate = filters.endDate.trim();
      }
      if (filters.month && filters.month !== '') {
        params.month = filters.month;
      }
      if (filters.year && filters.year !== '') {
        params.year = filters.year;
      }
      
      console.log('Enhanced filter params:', params);
      
      // Use enhanced filter endpoint
      const response = await managerService.filterLeavesEnhanced(params);
      
      // Safe array extraction using helper function
      const leavesArray = extractArray(response.data);
      
      // Sort by newest first using spread operator to avoid mutation
      const sortedLeaves = [...leavesArray].sort((a, b) => {
        const dateA = new Date(a.startDate || a.createdAt || 0);
        const dateB = new Date(b.startDate || b.createdAt || 0);
        return dateB - dateA; // Newest first (descending)
      });
      setLeaves(sortedLeaves);
    } catch (error) {
      console.error('Error fetching leaves:', error);
      setMessage('Error fetching leaves: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }

  const handleUserClick = async (employee) => {
    try {
      setSelectedUser(employee);
      setUserLeaves([]);
      setShowUserModal(true);
      
      // Fetch user's leaves
      const response = await managerService.getUserLeaves(employee.id);
      
      // Safe array extraction using helper function
      const userLeavesArray = extractArray(response.data);
      
      setUserLeaves(userLeavesArray);
    } catch (error) {
      console.error('Error fetching user leaves:', error);
      setMessage('Error fetching user leaves: ' + (error.response?.data?.message || error.message));
    }
  };

  async function fetchAllUsers() {
    try {
      setLoading(true);
      const response = await managerService.getAllUsers();
      
      // Safe array extraction using helper function
      const usersArray = extractArray(response.data);

      const uniqueUsers = Array.from(
        new Map(usersArray.map((u) => [u?.id ?? u?.email, u])).values()
      ).filter(Boolean);

      setUsers(uniqueUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage('Error fetching users: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  }

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleStatusChange = async (leaveId, status) => {
    if (status === 'approve') {
      setCommentPopup({ open: true, leaveId, action: 'approve', comment: '' });
    } else if (status === 'reject') {
      setCommentPopup({ open: true, leaveId, action: 'reject', comment: '' });
    }
  };

  const handleActionSubmit = async () => {
    const { leaveId, action, comment } = commentPopup;
    setActionLoading(prev => ({ ...prev, [leaveId]: true }));
    
    try {
      if (action === 'approve') {
        await managerService.approveLeave(leaveId, comment);
        setMessage('Leave approved successfully!');
      } else {
        await managerService.rejectLeave(leaveId, comment);
        setMessage('Leave rejected successfully!');
      }
      
      // Refresh current section data
      if (activeSection === 'pending') {
        fetchPendingLeaves();
      } else if (activeSection === 'all') {
        fetchAllLeaves();
      }
      
      showUpdateMessage(`Leave ${action}d successfully!`);
      
    } catch (error) {
      console.error('Error updating leave:', error);
      setMessage('Error updating leave: ' + (error.response?.data?.message || error.message));
    } finally {
      setActionLoading(prev => ({ ...prev, [leaveId]: false }));
      setCommentPopup({ open: false, leaveId: null, action: null, comment: '' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordMessage('All password fields are required!');
      setTimeout(() => setPasswordMessage(''), 3000);
      return;
    }
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('New passwords do not match!');
      setTimeout(() => setPasswordMessage(''), 3000);
      return;
    }
    
    // Validate password length
    if (passwordData.newPassword.length < 8) {
      setPasswordMessage('New password must be at least 8 characters long!');
      setTimeout(() => setPasswordMessage(''), 3000);
      return;
    }
    
    setPasswordLoading(true);
    setPasswordMessage('');
    
    try {
      console.log('Updating password...');
      console.log('Password payload:', {
        currentPassword: passwordData.currentPassword ? '***' : 'MISSING',
        newPassword: passwordData.newPassword ? '***' : 'MISSING', 
        confirmPassword: passwordData.confirmPassword ? '***' : 'MISSING'
      });
      
      const response = await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      
      console.log('Password change response:', response);
      
      setPasswordMessage('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      setTimeout(() => {
        setPasswordMessage('');
        setShowPasswordModal(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordMessage(error.response?.data?.message || 'Failed to update password');
      setTimeout(() => setPasswordMessage(''), 5000);
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeSection={activeSection}
        menuItems={menuItems}
        handleSectionChange={handleSectionChange}
        user={user}
        handleLogout={handleLogout}
        leaves={leaves}
        users={users}
        setShowPasswordModal={setShowPasswordModal}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Top Navigation */}
        <nav className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-30">
          <div className="px-4 sm:px-6">
            <div className="flex items-center justify-between h-20">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#264CFC] to-[#1a3ba8] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>M</span>
                </div>
                <span className="text-sm font-medium text-slate-700" style={{ fontFamily: 'Poppins, sans-serif' }}>{user?.name || 'Manager'}</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Title */}
            <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {activeSection === "pending"
                  ? "Pending Leave Requests"
                  : activeSection === "users"
                    ? "Users"
                    : "All Leave Requests"}
              </h2>

              {activeSection === "users" && (
                <span className="px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-700 rounded-full">
                  {users.filter(u => 
                    u?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u?.email?.toLowerCase().includes(searchTerm.toLowerCase())
                  ).length} Users
                </span>
              )}
            </div>
              <p className="text-gray-500 mt-1">
                {activeSection === "pending"
                  ? "Review and manage employee leave applications"
                  : activeSection === "users"
                    ? "Search and view employees, access leave history"
                    : "View all leave requests with filtering options"}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={refreshData}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw
                  className={`w-4 h-4 ${
                    loading || isRefreshing ? "animate-spin" : ""
                  }`}
                />
                Refresh
              </button>

              {lastUpdate && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>

          {/* Professional Filter Section - Only for All Leaves / Pending */}
          {(activeSection === "all" || activeSection === "pending") && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4 cursor-pointer" onClick={() => setShowFilters(!showFilters)}>
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M9 12h6"/>
                    </svg>
                  </div>
                  Filter Leave Requests
                </h3>
                <div className="flex items-center gap-2">
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${showFilters ? 'rotate-180' : ''}`} />
                  <div className="flex items-center gap-2 text-xs text-slate-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    Active Filters
                  </div>
                </div>
              </div>

              {/* Filter Body */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                showFilters ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                {/* Name Search - Standalone */}
                <div className="mb-6">
                  <label className="block text-xs font-medium text-slate-600 mb-2 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Search by Employee Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={filters.userName || ''}
                      onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
                      placeholder="Enter employee name to search..."
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 11 14 0 7 7 7z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {/* Month Filter */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Month
                    </label>
                    <select
                      value={filters.month || ''}
                      onChange={(e) => setFilters({ ...filters, month: e.target.value ? Number(e.target.value) : '' })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      <option value="">All Months</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {new Date(2000, i).toLocaleString('default', { month: 'short' })}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Year Filter */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Year
                    </label>
                    <select
                      value={filters.year || ''}
                      onChange={(e) => setFilters({ ...filters, year: e.target.value ? Number(e.target.value) : '' })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      <option value="">All Years</option>
                      {Array.from({ length: 5 }, (_, i) => (
                        <option key={i} value={new Date().getFullYear() - i}>
                          {new Date().getFullYear() - i}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Leave Type Filter */}
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1 uppercase tracking-wider" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      Type
                    </label>
                    <select
                      value={filters.leaveType || ''}
                      onChange={(e) => setFilters({ ...filters, leaveType: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                      <option value="">All Types</option>
                      <option value="casual">Casual Leave</option>
                      <option value="HALF_DAY">Half Day</option>
                      <option value="privilege">Privilege Leave</option>
                    </select>
                  </div>
                </div>

                {/* Filter Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    onClick={() => setFilters({ userName: '', month: '', year: '', leaveType: '', startDate: '', endDate: '', status: '' })}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm hover:bg-slate-50 transition-all duration-200 font-medium"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={activeSection === 'pending' ? fetchPendingLeaves : fetchAllLeaves}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition-all duration-200 shadow-sm font-medium"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-xl text-sm font-medium ${
                message.includes("success")
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                  : "bg-rose-50 border border-rose-200 text-rose-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Real-time Update - Only show in pending section */}
          {updateMessage && activeSection === 'pending' && (
            <div className="mb-6 p-4 rounded-xl text-sm font-medium bg-green-50 border border-green-200 text-green-700 animate-pulse">
              {updateMessage}
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : activeSection === 'users' ? (() => {
            const filteredUsers = users.filter(u => 
              u?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              u?.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            
            if (!users || users.length === 0 || filteredUsers.length === 0) {
              return (
                <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-slate-200">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    No Users Found
                  </h3>
                  <p className="text-slate-500 text-sm max-w-md mx-auto">
                    Try adjusting your search terms or check if users exist.
                  </p>
                </div>
              );
            }
            
            return (
              <UsersTable 
                users={users} 
                handleUserClick={handleUserClick} 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              />
            );
          })() : !leaves || leaves.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">
                {activeSection === "pending" ? "All Caught Up!" : "No Data Found"}
              </h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto">
                {activeSection === "pending"
                  ? "No pending leave requests to review."
                  : "No leave requests found for the selected filters."}
              </p>
            </div>
          ) : (
            <LeaveTable
              leaves={leaves}
              activeSection={activeSection}
              handleStatusChange={handleStatusChange}
              actionLoading={actionLoading}
              handleUserClick={handleUserClick}
            />
          )}
        </main>

        {/* User Modal */}
        <UserModal
          showUserModal={showUserModal}
          setShowUserModal={setShowUserModal}
          selectedUser={selectedUser}
          userLeaves={userLeaves}
        />

        {/* Comment Popup */}
        <CommentPopup
          commentPopup={commentPopup}
          setCommentPopup={setCommentPopup}
          handleActionSubmit={handleActionSubmit}
          actionLoading={actionLoading}
        />

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Change Password
                </h3>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordMessage('');
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Enter current password"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Enter new password (min 8 characters)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    placeholder="Confirm new password"
                    required
                  />
                </div>

                {passwordMessage && (
                  <div className={`p-3 rounded-lg text-sm ${
                    passwordMessage.includes('successfully') 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}>
                    {passwordMessage}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordMessage('');
                      setPasswordData({
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: ''
                      });
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;



