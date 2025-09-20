import React from 'react';
import ReactECharts from 'echarts-for-react';

const SalesChart = ({ title, data, xKey, yKey }) => {
  const option = {
    title: {
      text: title,
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params) {
        return params[0].name + ': $' + params[0].value;
      }
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item[xKey])
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: function(value) {
          return '$' + value;
        }
      }
    },
    series: [{
      data: data.map(item => item[yKey]),
      type: 'bar',
      itemStyle: {
        color: '#5470c6'
      }
    }]
  };

  return (
    <div className="chart-container">
      <ReactECharts option={option} style={{ height: '400px' }} />
    </div>
  );
};

export default SalesChart;