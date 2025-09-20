import React, { useState, useEffect } from 'react';
import ReportsTable from '../components/ReportsTable';
import SalesChart from '../components/SalesChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { getReports } from '../services/api';
import './ReportsHistory.css';

const ReportsHistory = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
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

  const handleReportSelect = (report) => {
    setSelectedReport(report);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="reports-history">
      <h1>Reports History</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="reports-content">
        <div className="reports-list">
          <h2>Generated Reports</h2>
          <ReportsTable 
            reports={reports} 
            onReportSelect={handleReportSelect} 
          />
        </div>
        
        {selectedReport && (
          <div className="report-details">
            <h2>Report Details</h2>
            <div className="metrics-grid">
              <div className="metric">
                <h3>Total Orders</h3>
                <p>{selectedReport.totalOrders}</p>
              </div>
              <div className="metric">
                <h3>Total Revenue</h3>
                <p>${selectedReport.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="metric">
                <h3>Average Order Value</h3>
                <p>${selectedReport.avgOrderValue.toFixed(2)}</p>
              </div>
            </div>
            
            <div className="charts-section">
              <SalesChart
                title="Region-wise Sales"
                data={selectedReport.regionWiseStats}
                xKey="region"
                yKey="revenue"
              />
              <SalesChart
                title="Category-wise Performance"
                data={selectedReport.categoryWiseStats}
                xKey="category"
                yKey="revenue"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsHistory;