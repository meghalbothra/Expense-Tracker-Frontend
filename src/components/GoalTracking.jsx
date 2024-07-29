import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast, ToastContainer, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../styles/GoalTracking.css";

const GoalTracking = () => {
  const [goals, setGoals] = useState([]);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [newGoalAllocation, setNewGoalAllocation] = useState('');
  const [additionalAllocation, setAdditionalAllocation] = useState({});

  // Get token from cookies
  const token = Cookies.get('token');

  const fetchGoals = async () => {
    try {
      const response = await axios.get('https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/goals', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedGoals = response.data.map(goal => ({
        ...goal,
        amount: parseFloat(goal.amount),
        allocation: parseFloat(goal.allocation),
        achieved: parseFloat(goal.allocation) >= parseFloat(goal.amount)
      }));
      setGoals(fetchedGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleAddGoal = async () => {
    const amount = parseFloat(newGoalAmount);
    const allocation = parseFloat(newGoalAllocation);

    if (newGoalName && amount > 0 && allocation >= 0) {
      if (allocation > amount) {
        toast.error("Initial allocation cannot exceed the goal amount.", {
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
        return;
      }

      const newGoal = { name: newGoalName, amount, allocation };

      try {
        const response = await axios.post('https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/goals', newGoal, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGoals([...goals, { ...response.data, amount, allocation, achieved: false }]);
        setNewGoalName('');
        setNewGoalAmount('');
        setNewGoalAllocation('');

        // Show success toast notification
        toast.success('Goal added successfully!', {
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
        console.error('Error adding goal:', error);
        // Show error toast notification
        toast.error('Error adding goal. Please try again.', {
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
      toast.error("Please fill in all fields with valid amounts.", {
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

  const handleAdditionalAllocationChange = (index, value) => {
    const updatedAllocations = { ...additionalAllocation, [index]: value };
    setAdditionalAllocation(updatedAllocations);
  };

  const handleAddAllocation = async (index) => {
    const amountToAdd = parseFloat(additionalAllocation[index]);
    
    if (isNaN(amountToAdd) || amountToAdd <= 0) {
      toast.error("Please enter a valid amount to add.", {
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
      return;
    }
    
    const goal = goals[index];
    const currentAllocation = parseFloat(goal.allocation);
    const newAllocation = currentAllocation + amountToAdd;
    
    if (newAllocation > goal.amount) {
      toast.error("New allocation cannot exceed the goal amount.", {
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
      return;
    }

    try {
      const response = await axios.put(`https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/goals/${goal.id}`, { allocation: amountToAdd }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const updatedGoal = { ...goal, allocation: newAllocation, achieved: newAllocation >= goal.amount };
        const updatedGoals = goals.map((g, idx) => idx === index ? updatedGoal : g);
        setGoals(updatedGoals);
        setAdditionalAllocation((prev) => ({ ...prev, [index]: '' }));

        // Show success toast notification
        toast.success('Allocation added successfully!', {
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
      } else {
        console.error('Unexpected response:', response);
        toast.error('Failed to update goal allocation. Please try again later.', {
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
    } catch (error) {
      console.error('Error updating goal allocation:', error);
      // Show error toast notification
      toast.error('Error updating goal allocation. Please try again later.', {
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

  const handleDeleteGoal = async (id, name) => {
    try {
      const response = await axios.delete(`https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/goals/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const updatedGoals = goals.filter(goal => goal.id !== id);
        setGoals(updatedGoals);

        // Show success toast notification
        toast.success(`Goal "${name}" deleted successfully!`, {
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
      } else {
        console.error('Unexpected response:', response);
        toast.error('Failed to delete goal. Please try again later.', {
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
    } catch (error) {
      console.error('Error deleting goal:', error);
      // Show error toast notification
      toast.error('Error deleting goal. Please try again later.', {
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

  return (
    <div className="goal-tracking-container">
      <ToastContainer /> {/* ToastContainer to render toast notifications */}
      <h2>Goal Tracking</h2>
      <div className="new-goal-form">
        <input
          type="text"
          placeholder="Goal Name"
          value={newGoalName}
          onChange={(e) => setNewGoalName(e.target.value)}
          className="goal-input"
        />
        <input
          type="number"
          placeholder="Goal Amount"
          value={newGoalAmount}
          onChange={(e) => setNewGoalAmount(e.target.value)}
          className="goal-input"
        />
        <input
          type="number"
          placeholder="Initial Allocation"
          value={newGoalAllocation}
          onChange={(e) => setNewGoalAllocation(e.target.value)}
          className="goal-input"
        />
        <button onClick={handleAddGoal} className="add-goal-button">Add Goal</button>
      </div>
      <div className="goals-list">
        {goals.map((goal, index) => (
          <div key={index} className="goal-item">
            <h4>{goal.name}</h4>
            <p>Target Amount: ${goal.amount ? goal.amount.toFixed(2) : 'N/A'}</p>
            <p>Amount Allocated: ${goal.allocation ? goal.allocation.toFixed(2) : 'N/A'}</p>
            <div className="progress-bar-container">
              {goal.amount && goal.allocation && (
                <div
                  className={`progress-bar ${goal.allocation / goal.amount < 0.2 ? 'progress-bar-low' : ''}`}
                  style={{ width: `${(goal.allocation / goal.amount) * 100}%` }}
                >
                  {`${((goal.allocation / goal.amount) * 100).toFixed(2)}%`}
                </div>
              )}
            </div>
            {goal.achieved && <p className="goal-achieved">Goal Achieved!</p>}
            {!goal.achieved && (
              <div className="additional-allocation">
                <input
                  type="number"
                  placeholder="Add Amount"
                  value={additionalAllocation[index] || ''}
                  onChange={(e) => handleAdditionalAllocationChange(index, e.target.value)}
                  className="goal-input"
                />
                <button onClick={() => handleAddAllocation(index)} className="add-allocation-button">Add</button>
              </div>
            )}
            <button onClick={() => handleDeleteGoal(goal.id, goal.name)} className="delete-goal-button">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalTracking;
