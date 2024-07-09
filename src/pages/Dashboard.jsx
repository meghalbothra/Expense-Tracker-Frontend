import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Summary from '../components/Summary';
import ExpenseLimit from '../components/ExpenseLimit';
import GoalTracking from '../components/GoalTracking';
import Graphs from '../components/Graphs';
import AIInsights from '../components/AIInsights';
import BudgetTracker from '../components/BudgetTracking'; // Import the BudgetTracker component
import "../styles/Dashboard.css";
import Footer from '../components/Footer';

const Dashboard = () => {
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);
  const [balanceData, setBalanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedIncomeData = [1000, 1500, 1200, 1800, 2000, 2500];
        const fetchedExpenseData = [800, 900, 1000, 1100, 1200, 1300];
        const fetchedBalanceData = [200, 600, 200, 700, 800, 1200];
        const fetchedTransactions = [
          { date: '2024-06-01', description: 'Grocery', amount: '-$50' },
          { date: '2024-06-02', description: 'Salary', amount: '+$1500' },
          { date: '2024-06-03', description: 'Electricity Bill', amount: '-$75' },
        ];

        setIncomeData(fetchedIncomeData);
        setExpenseData(fetchedExpenseData);
        setBalanceData(fetchedBalanceData);

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const totalIncome = incomeData.reduce((acc, val) => acc + val, 0);
  const totalExpenses = expenseData.reduce((acc, val) => acc + val, 0);
  const currentBalance = balanceData[balanceData.length - 1];

  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="dashboard-content">
        <div className="dashboard-section">
          <Summary />
        </div>
        <div className="dashboard-section">
          <AIInsights incomeData={incomeData} expenseData={expenseData} />
        </div>
        <div className="dashboard-section-graph">
          <Graphs incomeData={incomeData} balanceData={balanceData} expenseData={expenseData} />
        </div>
        <div className="dashboard-section">
          <ExpenseLimit />
        </div>
        <div className="dashboard-section">
          <BudgetTracker />
        </div>
        <div className="dashboard-section">
          <GoalTracking />
        </div>
        <div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
