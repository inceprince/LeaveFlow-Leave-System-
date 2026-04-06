import { useState, useCallback } from 'react';
import { managerService } from '../services/api';

export const useRealTimeUpdates = (activeSection, filters) => {
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
        await managerService.getPendingLeaves();
        showUpdateMessage('Pending requests updated');
      } else if (activeSection === 'all') {
        await managerService.filterLeaves(filters);
        showUpdateMessage('All leaves updated');
      } else if (activeSection === 'users') {
        await managerService.getAllUsers();
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

  return {
    lastUpdate,
    updateMessage,
    isRefreshing,
    refreshData,
    showUpdateMessage
  };
};
