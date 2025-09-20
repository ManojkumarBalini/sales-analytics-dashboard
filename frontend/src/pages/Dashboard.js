import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DateRangePicker from '../components/DateRangePicker';
import MetricsCard from '../components/MetricsCard';
import SalesChart from '../components/SalesChart';
import LoadingSpinner from '../components/LoadingSpinner';
import { generateReport } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dataAvailable, setDataAvailable] = useState(true);

  const handleGenerateReport = async () => {
    setLoading(true);
    setError('');
    setReport(null);
    
    try {
      const response = await generateReport(dateRange);
      setReport(response.data.report);
      setDataAvailable(true);
    } catch (err) {
      if (err.response?.data?.error === 'No data found for the selected date range') {
        setDataAvailable(false);
        setError('No sales data available for the selected date range. Please try a different range.');
      } else {
        setError(err.response?.data?.error || 'Failed to generate report. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Sales Analytics Dashboard
      </motion.h1>
      
      <motion.div 
        className="date-range-section"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChange={setDateRange}
        />
        <motion.button 
          onClick={handleGenerateReport} 
          disabled={loading}
          className="generate-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </motion.button>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {loading && <LoadingSpinner />}
      </AnimatePresence>

      <AnimatePresence>
        {!dataAvailable && !loading && (
          <motion.div 
            className="no-data-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3>No Data Available</h3>
            <p>There is no sales data for the selected date range. Please try a different range.</p>
            <p>Suggested ranges:</p>
            <ul>
              <li>
                <button 
                  onClick={() => setDateRange({
                    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
                    endDate: new Date()
                  })}
                  className="suggested-range-btn"
                >
                  Last 30 Days
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setDateRange({
                    startDate: new Date(new Date().setMonth(new Date().getMonth() - 3)),
                    endDate: new Date()
                  })}
                  className="suggested-range-btn"
                >
                  Last 3 Months
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setDateRange({
                    startDate: new Date(new Date().getFullYear(), 0, 1),
                    endDate: new Date()
                  })}
                  className="suggested-range-btn"
                >
                  Year to Date
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {report && dataAvailable && (
          <motion.div 
            className="report-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="report-header" variants={itemVariants}>
              <h2>Analytics Report</h2>
              <p className="report-date-range">
                {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
              </p>
            </motion.div>

            <motion.div className="metrics-grid" variants={containerVariants}>
              <MetricsCard
                title="Total Orders"
                value={report.totalOrders}
                icon="📦"
                variants={itemVariants}
              />
              <MetricsCard
                title="Total Revenue"
                value={`$${report.totalRevenue.toLocaleString()}`}
                icon="💰"
                variants={itemVariants}
              />
              <MetricsCard
                title="Avg Order Value"
                value={`$${report.avgOrderValue.toFixed(2)}`}
                icon="📊"
                variants={itemVariants}
              />
            </motion.div>

            <motion.div className="charts-section" variants={containerVariants}>
              <SalesChart
                title="Region-wise Sales"
                data={report.regionWiseStats}
                xKey="region"
                yKey="revenue"
                variants={itemVariants}
              />
              <SalesChart
                title="Category-wise Performance"
                data={report.categoryWiseStats}
                xKey="category"
                yKey="revenue"
                variants={itemVariants}
              />
            </motion.div>

            <motion.div className="top-lists" variants={containerVariants}>
              <motion.div className="top-products" variants={itemVariants}>
                <h3>Top Products</h3>
                <ul>
                  {report.topProducts.map((product, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="product-name">{product.name}</span>
                      <span className="product-stats">
                        {product.quantity} sold (${product.revenue.toLocaleString()})
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div className="top-customers" variants={itemVariants}>
                <h3>Top Customers</h3>
                <ul>
                  {report.topCustomers.map((customer, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <span className="customer-name">{customer.name}</span>
                      <span className="customer-stats">
                        {customer.orderCount} orders (${customer.totalSpent.toLocaleString()})
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Dashboard;
