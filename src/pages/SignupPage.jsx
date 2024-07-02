
import React from 'react';
import Signup from '../components/Signup';
import '../styles/SignupLogin.css';
import 'react-toastify/ReactToastify.css'

const SignupPage = () => {
  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <Signup />
      </div>
    </div>
  );
};

export default SignupPage;
