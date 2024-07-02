// Chart.js
import React from 'react';
import { PieChart } from 'react-minimal-pie-chart';

const Chart = ({ data }) => {
  return (
    <div className="chart">
      <h3>Income vs Expenses</h3>
      <PieChart
        data={[
          { title: 'Income', value: data.income, color: '#4caf50' },
          { title: 'Expenses', value: data.expenses, color: '#f44336' },
        ]}
      />
    </div>
  );
};

export default Chart;
