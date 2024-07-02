import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useLocation } from 'react-router-dom';
import "../styles/BudgetTracking.css";

const BudgetTracker = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();

  const allCategories = ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Health', 'Education', 'Miscellaneous'];

  const fetchData = async () => {
    try {
      const token = Cookies.get('token');
      const userId = Cookies.get('userId');

      const response = await axios.get(`http://localhost:8000/api/v1/expenses?userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const expenses = response.data;

      const categoryTotals = expenses.reduce((acc, expense) => {
        const { category, amount } = expense;
        if (acc[category]) {
          acc[category] += parseFloat(amount);
        } else {
          acc[category] = parseFloat(amount);
        }
        return acc;
      }, {});

      const formattedData = allCategories.map(category => ({
        name: category,
        value: categoryTotals[category] || 0,
      }));

      console.log('Formatted Data:', formattedData);

      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data from the server.');
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data when the component mounts or when the location changes
  }, [location]);

  const refreshData = () => {
    fetchData(); // Function to refresh data
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="budget-tracker-container">
      <h2>Expense Categories</h2>
      <div className="bar-chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetTracker;
