import React from 'react';
import { motion } from 'framer-motion';

const MetricsCard = ({ title, value, icon, variants }) => {
  return (
    <motion.div 
      className="metrics-card"
      variants={variants}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)"
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="metrics-icon">{icon}</div>
      <div className="metrics-content">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </motion.div>
  );
};

export default MetricsCard;