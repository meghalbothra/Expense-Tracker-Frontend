// LoginPage.js
import React from 'react';
import Login from '../components/Login';
import '../styles/SignupLogin.css';

const LoginPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
