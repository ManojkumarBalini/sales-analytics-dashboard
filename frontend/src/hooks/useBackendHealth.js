import { useState, useEffect } from 'react';
import { healthCheck } from '../services/api';

const useBackendHealth = () => {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        setError('Cannot connect to backend server. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    checkBackendHealth();
    
    // Check every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { isBackendConnected, loading, error };
};

export default useBackendHealth;
