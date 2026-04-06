import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/api';

export const useRealTimeLeaves = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    try {
      const response = await userService.getMyLeaves();
      setLeaves(response.data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching leaves:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch only
  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  return {
    leaves,
    loading,
    lastUpdated,
    refetch: fetchLeaves
  };
};
