import React, { useState, useEffect } from 'react';

const Filter = ({ incomeTransactions, expenseTransactions, allTransactions }) => {
  const [filteredTransactions, setFilteredTransactions] = useState(allTransactions);
  const [type, setType] = useState('All');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    handleFilter();
  }, [type, minAmount, maxAmount, startDate, endDate]);

  const handleFilter = () => {
    let transactions = allTransactions;

    if (type === 'Income') {
      transactions = incomeTransactions;
    } else if (type === 'Expense') {
      transactions = expenseTransactions;
    }

    let filtered = transactions;
    
    if (minAmount) {
      filtered = filtered.filter(transaction => transaction.amount >= parseFloat(minAmount));
    }
    
    if (maxAmount) {
      filtered = filtered.filter(transaction => transaction.amount <= parseFloat(maxAmount));
    }

    if (startDate) {
      filtered = filtered.filter(transaction => new Date(transaction.date) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(transaction => new Date(transaction.date) <= new Date(endDate));
    }
    
    setFilteredTransactions(filtered);
  };

  return (
    <div className="filter">
      <h3>Filter</h3>
      <div className="filter-group">
        <label>Type: </label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="All">All</option>
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Min Amount: </label>
        <input type="number" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
      </div>
      <div className="filter-group">
        <label>Max Amount: </label>
        <input type="number" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
      </div>
      <div className="filter-group">
        <label>Start Date: </label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      </div>
      <div className="filter-group">
        <label>End Date: </label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      </div>
      <button className="filter-button" onClick={handleFilter}>Apply Filter</button>
      <div className="filter-results">
        {filteredTransactions && filteredTransactions.length > 0 ? (
          filteredTransactions.map(transaction => (
            <div key={transaction.id} className="filter-transaction-item">
              <h4>{transaction.title}</h4>
              <p>{transaction.type}: ${transaction.amount}</p>
              <p>Date: {transaction.date}</p>
            </div>
          ))
        ) : (
          <p>No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Filter;
