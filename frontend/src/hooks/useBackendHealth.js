import { useState, useEffect } from 'react';
import { healthCheck } from '../services/api';

const useBackendHealth = () => {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        setLoading(true);
        const response = await healthCheck();
        if (response.status === 200) {
          setIsBackendConnected(true);
          setError('');
        }
      } catch (error) {
        console.error('Backend health check failed:', error);
        setIsBackendConnected(false);
        
        if (retryCount < 5) {
          setError(`Cannot connect to backend server. Retrying... (${retryCount + 1}/5)`);
          setRetryCount(retryCount + 1);
        } else {
          setError('Cannot connect to backend server. Please make sure the backend is running at: https://sales-analytics-dashboard-0x4w.onrender.com');
        }
      } finally {
        setLoading(false);
      }
    };

    checkBackendHealth();
    
    // Check every 30 seconds if not connected
    const interval = setInterval(() => {
      if (!isBackendConnected && retryCount < 5) {
        checkBackendHealth();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [isBackendConnected, retryCount]);

  return { isBackendConnected, loading, error };
};

export default useBackendHealth;
