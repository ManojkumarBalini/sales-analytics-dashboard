import { useState, useEffect } from 'react';
import { healthCheck } from '../services/api';

const useBackendHealth = () => {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const checkBackendHealth = async () => {
    try {
      setLoading(true);
      const response = await healthCheck();
      if (response.status === 200) {
        setIsBackendConnected(true);
        setError('');
        setRetryCount(0);
      }
    } catch (error) {
      console.error('Backend health check failed:', error);
      setIsBackendConnected(false);
      
      if (retryCount < 3) {
        setError(`Cannot connect to backend server. Retrying... (${retryCount + 1}/3)`);
        setRetryCount(retryCount + 1);
        
        // Retry after 5 seconds
        setTimeout(() => {
          checkBackendHealth();
        }, 5000);
      } else {
        setError('Cannot connect to backend server. Please make sure the backend is running at: https://sales-analytics-dashboard-0x4w.onrender.com');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkBackendHealth();
    
    // Check every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { isBackendConnected, loading, error, retry: checkBackendHealth };
};

export default useBackendHealth;
