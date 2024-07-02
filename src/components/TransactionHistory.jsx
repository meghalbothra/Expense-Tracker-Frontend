import React from 'react';

const TransactionHistory = ({ transactions }) => {
  return (
    <div className="transaction-history">
      <h3>Transaction History</h3>
      {transactions.map(transaction => (
        <div key={transaction.id} className="transaction-item">
          <h4>{transaction.title}</h4>
          <p>{transaction.type}: ${transaction.amount}</p>
        </div>
      ))}
    </div>
  );
};

export default TransactionHistory;
