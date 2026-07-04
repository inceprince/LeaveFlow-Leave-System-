import React from 'react';
import { BarChart2, Clock, CheckCircle, XCircle, Umbrella, TrendingUp } from 'lucide-react';
import { attendanceData } from '../data/mockData';

const statusConfig = {
  present: { label: 'Present', color: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  absent:  { label: 'Absent',  color: 'bg-rose-500',    text: 'text-rose-600 dark:text-rose-400',       bg: 'bg-rose-50 dark:bg-rose-900/20'    },
  leave:   { label: 'On Leave', color: 'bg-amber-500',  text: 'text-amber-600 dark:text-amber-400',     bg: 'bg-amber-50 dark:bg-amber-900/20'  },
  weekend: { label: 'Weekend', color: 'bg-slate-300',   text: 'text-slate-500 dark:text-slate-400',     bg: 'bg-slate-50 dark:bg-slate-700/30'  },
};

const AttendanceDashboard = () => {
  const { currentMonth, recentAttendance } = attendanceData;

  const circumference = 2 * Math.PI * 38;
  const offset = circumference - (currentMonth.percentage / 100) * circumference;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Present Days</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{currentMonth.present}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-100 dark:bg-rose-900/50 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Absent Days</p>
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{currentMonth.absent}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
              <Umbrella className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">On Leave</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{currentMonth.onLeave}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Working Days</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{currentMonth.totalWorkingDays}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance % + Recent Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Percentage Ring */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm flex flex-col items-center justify-center">
          <div className="flex items-center gap-3 mb-5 self-start">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">This Month</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Attendance rate</p>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <svg width="100" height="100" className="-rotate-90">
              <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-100 dark:text-slate-700" />
              <circle
                cx="50" cy="50" r="38"
                fill="none" stroke="url(#grad)" strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-2xl font-bold text-slate-800 dark:text-slate-100">{currentMonth.percentage}%</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 w-full text-xs text-center">
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-2">
              <p className="text-slate-400 dark:text-slate-500">Present</p>
              <p className="font-bold text-slate-700 dark:text-slate-200">{currentMonth.present}/{currentMonth.totalWorkingDays}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-2">
              <p className="text-slate-400 dark:text-slate-500">Holidays</p>
              <p className="font-bold text-slate-700 dark:text-slate-200">{currentMonth.holidays} days</p>
            </div>
          </div>
        </div>

        {/* Recent Attendance Log */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Attendance</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Last 10 days</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-3">Date</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-3">Check In</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-3">Check Out</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-3">Hours</th>
                  <th className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {recentAttendance.map((row, i) => {
                  const cfg = statusConfig[row.status];
                  return (
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
                      <td className="py-2.5 text-slate-700 dark:text-slate-200 font-medium">
                        {new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })}
                      </td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300">{row.checkIn}</td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300">{row.checkOut}</td>
                      <td className="py-2.5 text-slate-600 dark:text-slate-300">{row.hours}</td>
                      <td className="py-2.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.color}`} />
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
