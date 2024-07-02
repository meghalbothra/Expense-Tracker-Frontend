import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Chart as ChartJS } from 'chart.js';
import Cookies from 'js-cookie'; // Import js-cookie library
import "../styles/Graphs.css"; // Import your CSS file for styling

const Graphs = () => {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);  // Ref to keep track of Chart instance

  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [balanceData, setBalanceData] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (chartRef.current) {
        chartRef.current.destroy();  // Destroy existing chart instance
      }
      chartRef.current = new ChartJS(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Income',
              data: incomeData,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
              label: 'Balance',
              data: balanceData,
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
            },
            {
              label: 'Expense',
              data: expenseData,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }
  }, [incomeData, expenseData, balanceData, labels]);

  const fetchData = async () => {
    try {
      const token = Cookies.get('token'); // Retrieve token from cookie
      const userId = Cookies.get('userId'); // Retrieve userId from cookie

      const incomeResponse = await axios.get(`http://localhost:8000/api/v1/income?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Include token in headers
        }
      });
      const expenseResponse = await axios.get(`http://localhost:8000/api/v1/expenses?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Include token in headers
        }
      });

      const incomeData = processMonthlyData(incomeResponse.data);
      const expenseData = processMonthlyData(expenseResponse.data);
      const balanceData = incomeData.map((income, index) => income - expenseData[index]);

      setIncomeData(incomeData);
      setExpenseData(expenseData);
      setBalanceData(balanceData);
      setLabels(getLast6Months());
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const processMonthlyData = (data) => {
    const monthlyData = Array(6).fill(0);
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    data.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      if (transactionDate >= sixMonthsAgo) {
        const monthDiff = (transactionDate.getFullYear() - sixMonthsAgo.getFullYear()) * 12 + (transactionDate.getMonth() - sixMonthsAgo.getMonth());
        if (monthDiff >= 0 && monthDiff < 6) {
          monthlyData[monthDiff] += parseFloat(transaction.amount);
        }
      }
    });

    return monthlyData;
  };

  const getLast6Months = () => {
    const months = [];
    const date = new Date();
    date.setMonth(date.getMonth() - 5);
    for (let i = 0; i < 6; i++) {
      months.push(date.toLocaleString('default', { month: 'short' }));
      date.setMonth(date.getMonth() + 1);
    }
    return months;
  };

  return (
    <div className="graphs-container">
      <h2 className="graphs-title">Financial Analysis of Last 6 Months</h2>
      <div className="graphs-canvas-wrapper">
        <canvas ref={canvasRef} className="graphs-canvas"></canvas>
      </div>
    </div>
  );
};

export default Graphs;
