import { useState, useEffect } from 'react';
import { getReports } from '../services/api';

const useAnalytics = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getReports();
      setReports(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };

  return {
    reports,
    loading,
    error,
    refetch: fetchReports
  };
};

export default useAnalytics;