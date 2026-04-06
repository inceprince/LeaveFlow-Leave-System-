import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useTheme } from '../contexts/ThemeContext';

const EnhancedCalendar = ({ leaves = [] }) => {
  const { theme } = useTheme();

  const getTileClassName = ({ date, view }) => {
    if (view !== 'month') return '';

    const normalized = new Date(date).setHours(0, 0, 0, 0);

    const match = leaves.find((leave) => {
      const start = new Date(leave.startDate).setHours(0, 0, 0, 0);
      const end = new Date(leave.endDate).setHours(0, 0, 0, 0);
      return normalized >= start && normalized <= end;
    });

    if (match) {
      if (match.status === 'APPROVED') return 'status-approved';
      if (match.status === 'REJECTED') return 'status-rejected';
      if (match.status === 'PENDING') return 'status-pending';
    }

    if (date.getDay() === 0) return 'sunday';

    return '';
  };

  return (
    <div className="modern-calendar">
      <style jsx>{`
        .react-calendar {
          width: 100%;
          border: none;
          padding: 20px;
          border-radius: 20px;
          background: ${theme === 'dark' ? '#1e293b' : '#ffffff'};
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
        }

        /* Header Navigation */
        .react-calendar__navigation {
          margin-bottom: 20px;
        }

        .react-calendar__navigation button {
          font-weight: 600;
          font-size: 16px;
          color: ${theme === 'dark' ? '#e2e8f0' : '#1e293b'};
        }

        /* Weekdays */
        .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 1px;
          font-weight: 600;
          margin-bottom: 10px;
          color: ${theme === 'dark' ? '#94a3b8' : '#64748b'};
        }

        /* Tiles */
        .react-calendar__tile {
          border-radius: 14px;
          padding: 14px 0;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .react-calendar__tile:hover {
          background: ${theme === 'dark' ? '#334155' : '#f1f5f9'};
          transform: scale(1.08);
        }

        /* Today */
        .react-calendar__tile--now {
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          color: white !important;
          font-weight: 600;
          border-radius: 14px;
        }

        /* Approved (Soft ring) */
        .status-approved {
          box-shadow: inset 0 0 0 2px #34c759;
        }

        .status-approved::after {
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          margin: 4px auto 0;
          border-radius: 50%;
          background: #34c759;
        }

        /* Rejected */
        .status-rejected {
          box-shadow: inset 0 0 0 2px #ef4444;
        }

        .status-rejected::after {
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          margin: 4px auto 0;
          border-radius: 50%;
          background: #ef4444;
        }

        /* Pending */
        .status-pending {
          box-shadow: inset 0 0 0 2px #f59e0b;
        }

        .status-pending::after {
          content: '';
          display: block;
          width: 6px;
          height: 6px;
          margin: 4px auto 0;
          border-radius: 50%;
          background: #f59e0b;
        }

        /* Sunday text */
        .sunday {
          color: #ef4444 !important;
          font-weight: 600;
        }

        /* Remove weekend default */
        .react-calendar__month-view__days__day--weekend {
          color: inherit !important;
        }

      `}</style>

      <Calendar
        tileClassName={getTileClassName}
        showNeighboringMonth={false}
      />
    </div>
  );
};

export default EnhancedCalendar;
