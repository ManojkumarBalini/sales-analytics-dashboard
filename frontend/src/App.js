import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Dashboard from './pages/Dashboard';
import ReportsHistory from './pages/ReportsHistory';
import Navigation from './components/Navigation';
import useBackendHealth from './hooks/useBackendHealth';
import './App.css';

function App() {
  const { isBackendConnected, loading, error } = useBackendHealth();

  if (loading) {
    return (
      <div className="app-loading">
        <motion.div 
          className="spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        ></motion.div>
        <p>Checking backend connection...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        {!isBackendConnected && (
          <motion.div 
            className="connection-error"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h3>Backend Connection Error</h3>
            <p>{error || 'Unable to connect to the backend server.'}</p>
            <p>Please make sure the backend is running at: https://sales-analytics-dashboard-0x4w.onrender.com</p>
            <p>This might take a few minutes to start if it was inactive.</p>
          </motion.div>
        )}
        
        <Navigation />
        
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reports" element={<ReportsHistory />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
