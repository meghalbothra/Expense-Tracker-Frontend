import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/AIInsights.css";
import Cookies from 'js-cookie';

const AIInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [balanceState, setBalanceState] = useState(0);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        const token = Cookies.get('token');

        const incomeResponse = await axios.get('http://localhost:8000/api/v1/auth/income', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const incomeData = incomeResponse.data.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return transactionDate >= sixMonthsAgo;
        });

        const expenseResponse = await axios.get('http://localhost:8000/api/v1/auth/expenses', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const expenseData = expenseResponse.data.filter(transaction => {
          const transactionDate = new Date(transaction.date);
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
          return transactionDate >= sixMonthsAgo;
        });

        const totalIncome = calculateTotal(incomeData);
        const totalExpenses = calculateTotal(expenseData);
        const balance = totalIncome - totalExpenses;

        setBalanceState(balance);

        const insights = [
          `Your total income over the last 6 months is $${totalIncome}.`,
          `Your total expenses over the last 6 months are $${totalExpenses}.`,
          `Your current balance is $${balance}.`,
          balance > 1000 ? "Great job! You have a healthy balance." : "Consider cutting down on expenses to save more.",
          totalExpenses > totalIncome ? "Warning: Your expenses exceed your income." : "Your income covers your expenses."
        ];

        setInsights(insights);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching financial data:', error);
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []);

  const calculateTotal = (data) => {
    return data.reduce((acc, val) => acc + parseFloat(val.amount), 0);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="ai-insights">
      <h2>Financial Insights</h2>
      <ul>
        {insights.map((insight, index) => (
          <li key={index} className={index === insights.length - 1 ? (balanceState > 0 ? 'green-color' : 'red-color') : ''}>{insight}</li>
        ))}
      </ul>
    </div>
  );
};

export default AIInsights;
