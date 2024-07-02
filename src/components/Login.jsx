import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import '../styles/SignupLogin.css';
import logo from '../assets/Logo1.jpg';
import axios from "axios";
import { toast , Bounce } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { generateToken } from '../notifications/firebase'; // Import the generateToken function

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    const currentDate = new Date();
    const expirationDate = new Date(
      currentDate.getTime() + 24 * 60 * 60 * 1000
    );
    const expires = `expires=${expirationDate.toUTCString()}`;
    e.preventDefault();
  
    console.log({ email, password, fcmToken });
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/login", // Replace with actual backend URL
        { email, password, fcmToken },
        {
          headers: {
            Authorization: `Bearer ${document.cookie.split("=")[1]}`,
          },
        }
      );
  
      console.log("Login successful:", response.data);
      // Store the token in a cookie
      document.cookie = `token=${response.data.token}; ${expires}; path=/`;
      successfulLoginPopUp();
    } 
    catch (error) {
      toast.error("Log In Unsuccessful !!", {
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
      console.error(
        "Login failed:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const successfulLoginPopUp = () => {
    toast.success("Log In Successful!!", {
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
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="auth-form login-form">
      <img src={logo} alt="BudgetBuddy Logo" className="logo" />
      <h2>Welcome Back</h2>
      <p>Please login to your account</p>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" className="auth-button">
          Login
        </button>
      </form>
      <p>Don't have an account? <a href="/Signup">Signup</a></p>
    </div>
  );
};

export default Login;
