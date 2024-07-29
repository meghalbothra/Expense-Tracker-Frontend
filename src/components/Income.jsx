import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toastify
import '../styles/Income.css';

const Income = () => {
  const [incomeList, setIncomeList] = useState([]);
  const [newIncome, setNewIncome] = useState({ title: '', amount: '' });

  useEffect(() => {
    fetchIncomeData();
  }, []);

  const fetchIncomeData = async () => {
    try {
      const token = Cookies.get('token'); // Retrieve token from cookie
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
    if (newIncome.title !== '' && newIncome.amount !== '') {
      try {
        const token = Cookies.get('token'); // Retrieve token from cookie
        const response = await axios.post('https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/income', newIncome, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const newIncomeData = response.data;
        setIncomeList([...incomeList, newIncomeData]); // Update state with new income data
        setNewIncome({ title: '', amount: '' });

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
    }
  };

  const handleDeleteIncome = async (id) => {
    try {
      const token = Cookies.get('token'); // Retrieve token from cookie
      await axios.delete(`https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/income/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setIncomeList(incomeList.filter((income) => income.id !== id));
      // Show success toast notification for deletion
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
    return totalIncome.toFixed(2); // Ensure two decimal places for currency display
  };

  return (
    <div className="income-container">
      <ToastContainer /> {/* Add ToastContainer to render toast notifications */}
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