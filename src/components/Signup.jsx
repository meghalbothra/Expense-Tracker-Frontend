import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import '../styles/SignupLogin.css';
import logo from '../assets/Logo1.jpg';
import axios from "axios";
import { toast, Bounce, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { generateToken } from '../notifications/firebase'; // Import the generateToken function

const Signup = () => {
  const [Name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fcmToken, setFcmToken] = useState(null); // State to store FCM token
  let navigate = useNavigate();

  useEffect(() => {
    // Fetch the FCM token when the component mounts
    const fetchToken = async () => {
      const token = await generateToken();
      setFcmToken(token);
    };
    fetchToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });
      return;
    }

    const currentDate = new Date();
    const expirationDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const expires = `expires=${expirationDate.toUTCString()}`;

    try {
      const response = await axios.post('https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/register', { Name, email, password, fcmToken });

      // Store the token in a cookie
      document.cookie = `token=${response.data.token}; ${expires}; path=/`;

      toast.success('Registration Successful!', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
      });

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message === "Email already exists") {
        toast.error('User already exists with this email!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      } else {
        toast.error('Signup unsuccessful, Try Again!', {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
        console.error('Signup failed:', error.response ? error.response.data : error.message);
      }
    }
  };

  return (
    <div className="auth-form signup-form">
      <img src={logo} alt="BudgetBuddy Logo" className="logo" />
      <h2>Create an Account</h2>
      <p>Please fill in the following details</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <FaUser className="form-icon" />
          <input
            type="text"
            id="name"
            value={Name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Name"
          />
        </div>
        <div className="form-group">
          <FaEnvelope className="form-icon" />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
        </div>
        <div className="form-group">
          <FaLock className="form-icon" />
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </div>
        <div className="form-group">
          <FaLock className="form-icon" />
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
          />
        </div>
        <button type="submit" className="auth-button">
          Sign Up
        </button>
      </form>
      <p>Already have an account? <a href="/login">Login</a></p>
      <ToastContainer />
    </div>
  );
};

export default Signup;
