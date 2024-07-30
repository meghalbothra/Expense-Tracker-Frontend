import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Summary.css';
import { Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import Filter from '../components/Filter';
import Cookies from 'js-cookie'; // Import js-cookie library or relevant token management
import { useLocation } from 'react-router-dom'; 

const Summary = () => {
    const [incomeTransactions, setIncomeTransactions] = useState([]);
    const [expenseTransactions, setExpenseTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [balance, setBalance] = useState(0);
    const location = useLocation(); // Get the current location

    useEffect(() => {
        fetchTransactions();
    }, [location.key]); // Fetch transactions whenever location.key changes

    useEffect(() => {
        // Combine income and expense transactions into filteredTransactions
        setFilteredTransactions([...incomeTransactions, ...expenseTransactions]);
    }, [incomeTransactions, expenseTransactions]);

    const fetchTransactions = async () => {
        try {
            const token = Cookies.get('token'); // Retrieve token from cookie or context

            const incomeResponse = await axios.get(`https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/income`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const expenseResponse = await axios.get(`https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/expenses`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Assuming income transactions come directly from incomeResponse and expenses from expenseResponse
            setIncomeTransactions(incomeResponse.data);
            setExpenseTransactions(expenseResponse.data);

            // Calculate balance
            const totalIncome = calculateTotal(incomeResponse.data);
            const totalExpenses = calculateTotal(expenseResponse.data);
            const balance = totalIncome - totalExpenses;
            setBalance(balance);

            setLoading(false);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setLoading(false);
        }
    };

    const calculateTotal = (transactions) => {
        return transactions.reduce((acc, transaction) => acc + parseFloat(transaction.amount), 0);
    };

    const pieData = {
        labels: ['Income', 'Expenses'],
        datasets: [{
            data: [calculateTotal(incomeTransactions), calculateTotal(expenseTransactions)],
            backgroundColor: ['#36A2EB', '#FF6384'],
            hoverBackgroundColor: ['#36A2EB', '#FF6384']
        }]
    };

    const handleFilteredTransactions = (filteredTransactions) => {
        // Update filtered transactions based on the filter criteria passed from the Filter component
        setFilteredTransactions(filteredTransactions);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="summary-container">
            <h2 className="summary-heading">Financial Summary</h2>
            <div className="summary-grid">
                <div className="summary-section">
                    <h3>Total Income</h3>
                    <p className="summary-amount">${calculateTotal(incomeTransactions)}</p>
                </div>
                <div className="summary-section">
                    <h3>Total Expenses</h3>
                    <p className="summary-amount">${calculateTotal(expenseTransactions)}</p>
                </div>
                <div className="summary-section">
                    <h3>Balance</h3>
                    <p className={`summary-amount ${balance >= 0 ? 'positive-balance' : 'negative-balance'}`}>${balance}</p>
                </div>
                <div className="summary-section chart-container">
                    <Pie data={pieData} className="pie-chart" />
                </div>
                <div className="summary-section transaction-history">
                    <h3>Transaction History</h3>
                    <div>
                        {incomeTransactions.map((transaction) => (
                            <div className="transaction-item income" key={transaction.id}>
                                <h4>{transaction.title}</h4>
                                <p>Income: ${transaction.amount}</p>
                                <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
                            </div>
                        ))}
                        {expenseTransactions.map((transaction) => (
                            <div className="transaction-item expense" key={transaction.id}>
                                <h4>{transaction.title}</h4>
                                <p>Expense: ${transaction.amount}</p>
                                <p>Date: {new Date(transaction.date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="summary-section filter">
                    <Filter
                        incomeTransactions={incomeTransactions}
                        expenseTransactions={expenseTransactions}
                        allTransactions={[...incomeTransactions, ...expenseTransactions]}
                        onFilter={handleFilteredTransactions}
                    />
                </div>
            </div>
        </div>
    );
};

export default Summary;
