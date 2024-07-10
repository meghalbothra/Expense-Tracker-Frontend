import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify
import '../styles/ExpenseLimit.css';

const ExpenseLimit = () => {
    const [limit, setLimit] = useState(null);
    const [isLimitSet, setIsLimitSet] = useState(false);
    const [limitCrossed, setLimitCrossed] = useState(false);
    const [newLimit, setNewLimit] = useState('');
    const [totalExpenses, setTotalExpenses] = useState(0);

    useEffect(() => {
        fetchExpenseLimit();
        fetchTotalExpenses(); // Fetch total expenses for the current user
    }, [totalExpenses]); // Add totalExpenses to dependency array to re-fetch when it changes

    const fetchExpenseLimit = async () => {
        try {
            const userId = Cookies.get('userId');
            const token = Cookies.get('token');
            const response = await axios.get(`http://localhost:8000/api/v1/auth/expense-limit?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const { expenseLimit } = response.data;
            if (expenseLimit !== undefined) {
                setLimit(expenseLimit);
                setIsLimitSet(true);
                checkLimitCrossed(expenseLimit);
            }
        } catch (error) {
            console.error('Error fetching expense limit:', error);
        }
    };

    const fetchTotalExpenses = async () => {
        try {
            const userId = Cookies.get('userId');
            const token = Cookies.get('token');
            const response = await axios.get(`http://localhost:8000/api/v1/auth/expenses?userId=${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const expenses = response.data;
            const total = calculateTotal(expenses);
            setTotalExpenses(total);
        } catch (error) {
            console.error('Error fetching total expenses:', error);
        }
    };

    const calculateTotal = (expenses) => {
        return expenses.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
    };

    const handleSetLimit = async () => {
        const newLimitValue = parseFloat(newLimit);
        if (!isNaN(newLimitValue)) {
            try {
                const token = Cookies.get('token');
                await axios.put('http://localhost:8000/api/v1/auth/expense-limit', { expenseLimit: newLimitValue }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setLimit(newLimitValue);
                setIsLimitSet(true);
                checkLimitCrossed(newLimitValue);
                setNewLimit('');

                // Show success toast notification
                toast.success('Expense limit set successfully!', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide
                });
            } catch (error) {
                console.error('Error setting expense limit:', error);

                // Show error toast notification
                toast.error('Error setting expense limit. Please try again.', {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Slide
                });
            }
        } else {
            console.error('Invalid limit value:', newLimit);
        }
    };

    const checkLimitCrossed = (expenseLimit) => {
        setLimitCrossed(totalExpenses > expenseLimit);
    };

    return (
        <div className="expense-limit">
            <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
            <h3>Set Expense Limit</h3>
            <input 
                type="number" 
                value={newLimit}
                onChange={(e) => setNewLimit(e.target.value)}
                placeholder="Enter expense limit" 
            />
            <button className='expenselimit-button' onClick={handleSetLimit}>Set Limit</button>
            {isLimitSet && (
                <p>Expense Limit: ${limit}</p>
            )}
            {limitCrossed && (
                <p className="limit-crossed">Expense limit crossed! Total expenses have exceeded the set limit.</p>
            )}
            {!limitCrossed && isLimitSet && (
                <p>Expense limit not crossed.</p>
            )}
        </div>
    );
};

export default ExpenseLimit;
