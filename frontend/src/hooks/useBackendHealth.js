import { useState, useEffect } from 'react';
import api from '../services/api';

const useBackendHealth = () => {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        setLoading(true);
        await api.get('/health');
        setIsBackendConnected(true);
      } catch (error) {
        console.error('Backend health check failed:', error);
        setIsBackendConnected(false);
      } finally {
        setLoading(false);
      }
    };

    checkBackendHealth();
    
    // Check every 30 seconds
    const interval = setInterval(checkBackendHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { isBackendConnected, loading };
};

export default useBackendHealth;