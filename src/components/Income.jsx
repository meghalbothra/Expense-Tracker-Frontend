import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Income.css';

const Income = ({ onIncomeChange }) => {
    const [incomeList, setIncomeList] = useState([]);
    const [newIncome, setNewIncome] = useState({ title: '', amount: '' });

    useEffect(() => {
        fetchIncomeData();
    }, []);

    const fetchIncomeData = async () => {
        try {
            const token = Cookies.get('token');
            const response = await axios.get('https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/income', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setIncomeList(response.data);
        } catch (error) {
            console.error('Error fetching income data:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewIncome({ ...newIncome, [name]: value });
    };

    const handleAddIncome = async () => {
        if (newIncome.title.trim() === '' || newIncome.amount.trim() === '') {
            alert('Please fill in Title and Amount fields.');
            return;
        }

        try {
            const token = Cookies.get('token');
            const response = await axios.post('https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/income', newIncome, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setIncomeList([...incomeList, response.data]);
            setNewIncome({ title: '', amount: '' });

            // Notify parent component to refresh data (BudgetTracker)
            if (onIncomeChange) {
                onIncomeChange(); // Trigger refresh in BudgetTracker component
            }

            // Show success toast notification
            toast.success('Income added successfully!', {
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
            console.error('Error adding income:', error);

            // Show error toast notification
            toast.error('Error adding income. Please try again.', {
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
    };

    const handleDeleteIncome = async (id) => {
        try {
            const token = Cookies.get('token');
            await axios.delete(`https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/income/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Refresh the income data after deletion
            fetchIncomeData();

            // Notify parent component to refresh data (BudgetTracker)
            if (onIncomeChange) {
                onIncomeChange(); // Trigger refresh in BudgetTracker component
            }

            // Show success toast notification
            toast.success('Income deleted successfully!', {
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
            console.error('Error deleting income:', error);

            // Show error toast notification
            toast.error('Error deleting income. Please try again.', {
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
    };

    const calculateTotalIncome = () => {
        const totalIncome = incomeList.reduce((acc, income) => acc + parseFloat(income.amount), 0);
        return totalIncome.toFixed(2);
    };

    return (
        <div className="income-container">
            <ToastContainer />
            <h2 className="income-heading">Income</h2>
            <div className="income-list">
                {incomeList.map((income) => (
                    <div className="income-item" key={income.id}>
                        <h3 className="income-title">{income.title}</h3>
                        <p className="income-amount">${income.amount}</p>
                        {income.date && <p className="income-date">{new Date(income.date).toLocaleDateString()}</p>}
                        <button className="delete-button" onClick={() => handleDeleteIncome(income.id)}>Delete</button>
                    </div>
                ))}
            </div>
            <div className="add-income-form">
                <input
                    type="text"
                    name="title"
                    placeholder="Enter title"
                    value={newIncome.title}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Enter amount"
                    value={newIncome.amount}
                    onChange={handleInputChange}
                />
                <button className="add-button" onClick={handleAddIncome}>Add Income</button>
            </div>
            <div className="total-income">
                <h3>Total Income:</h3>
                <p>${calculateTotalIncome()}</p>
            </div>
        </div>
    );
};

export default Income;
