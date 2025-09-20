import React from 'react';
import { format } from 'date-fns';

const ReportsTable = ({ reports, onReportSelect }) => {
  if (!reports || reports.length === 0) {
    return <div className="no-reports">No reports available</div>;
  }

  return (
    <div className="reports-table">
      <table>
        <thead>
          <tr>
            <th>Report Date</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Total Orders</th>
            <th>Total Revenue</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td>{format(new Date(report.createdAt), 'MMM dd, yyyy')}</td>
              <td>{format(new Date(report.startDate), 'MMM dd, yyyy')}</td>
              <td>{format(new Date(report.endDate), 'MMM dd, yyyy')}</td>
              <td>{report.totalOrders}</td>
              <td>${report.totalRevenue.toLocaleString()}</td>
              <td>
                <button 
                  onClick={() => onReportSelect(report)}
                  className="view-btn"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportsTable;