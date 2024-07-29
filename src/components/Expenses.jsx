import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/Expenses.css';

const Expenses = ({ onExpenseChange }) => {
  const [expensesList, setExpensesList] = useState([]);
  const [newExpense, setNewExpense] = useState({ title: '', amount: '', category: 'Housing' });

  const categories = ['Housing', 'Food', 'Utilities', 'Transportation', 'Entertainment', 'Health', 'Other'];

  useEffect(() => {
    fetchExpensesData();
  }, []);

  const fetchExpensesData = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get('https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/expenses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setExpensesList(response.data);
    } catch (error) {
      console.error('Error fetching expenses data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleAddExpense = async () => {
    if (newExpense.title.trim() === '' || newExpense.amount.trim() === '') {
      alert('Please fill in Title and Amount fields.');
      return;
    }

    try {
      const token = Cookies.get('token');
      const response = await axios.post('https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/expenses', newExpense, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setExpensesList([...expensesList, response.data]);
      setNewExpense({ title: '', amount: '', category: 'Housing' });

      // Notify parent component to refresh data (BudgetTracker)
      if (onExpenseChange) {
        onExpenseChange(); // Trigger refresh in BudgetTracker component
      }

      // Show success toast notification
      toast.success('Expense added successfully!', {
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
      console.error('Error adding expense:', error);

      // Show error toast notification
      toast.error('Error adding expense. Please try again.', {
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

  const handleDeleteExpense = async (id) => {
    try {
      const token = Cookies.get('token');
      await axios.delete(`https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/expenses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setExpensesList(expensesList.filter((expense) => expense.id !== id));

      // Notify parent component to refresh data (BudgetTracker)
      if (onExpenseChange) {
        onExpenseChange(); // Trigger refresh in BudgetTracker component
      }

      // Show success toast notification
      toast.success('Expense deleted successfully!', {
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
      console.error('Error deleting expense:', error);

      // Show error toast notification
      toast.error('Error deleting expense. Please try again.', {
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

  const calculateTotalExpenses = () => {
    if (expensesList.length === 0) {
      return "0.00";
    }
    const totalExpenses = expensesList.reduce((acc, expense) => acc + parseFloat(expense.amount), 0);
    return totalExpenses.toFixed(2);
  };

  return (
    <div className="expenses-container">
      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
      <h2 className="expenses-heading">Expenses</h2>
      <div className="expenses-list">
        {expensesList.map((expense) => (
          <div className="expense-item" key={expense.id}>
            <h3 className="expense-title">{expense.title}</h3>
            <p className="expense-amount">${expense.amount}</p>
            <p className="expense-category">Category: {expense.category}</p>
            <p className="expense-date">{new Date(expense.date).toLocaleDateString()}</p>
            <button className="expense-delete-button" onClick={() => handleDeleteExpense(expense.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="add-expense-form">
        <input
          type="text"
          name="title"
          placeholder="Enter title"
          value={newExpense.title}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Enter amount"
          value={newExpense.amount}
          onChange={handleInputChange}
        />
        <select
          name="category"
          value={newExpense.category}
          onChange={handleInputChange}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>
        <button className="expense-add-button" onClick={handleAddExpense}>Add Expense</button>
      </div>
      <div className="total-expenses">
        <h3>Total Expenses:</h3>
        <p>${calculateTotalExpenses()}</p>
      </div>
    </div>
  );
};

export default Expenses;
