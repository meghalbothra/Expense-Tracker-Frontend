import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import IncomePage from './pages/Income';
import ExpensePage from './pages/Expenses';
import ReminderPage from './pages/Reminder';
import toast, { Toaster } from 'react-hot-toast';
import { ToastContainer, Bounce } from 'react-toastify';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode
import { getMessaging, onMessage } from 'firebase/messaging';
import { generateToken } from './notifications/firebase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);

  // Checking if token exists
  useEffect(() => {
    const tokenCookie = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));
    if (tokenCookie) {
      setIsLoggedIn(true); // Set isLoggedIn to true if token exists
      const tokenValue = tokenCookie.split("=")[1];
      setToken(tokenValue); // Extract token value from cookie
      try {
        const decodedToken = jwtDecode(tokenValue);
        console.log("decodedToken", decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // FCM Token generation
  useEffect(() => {
    generateToken().then((FCMtoken) => {
      setFcmToken(FCMtoken);
      // Update FCM token
      if (isLoggedIn) {
        const decodedToken = jwtDecode(token);
        updateFcmToken(decodedToken, FCMtoken);
      }
    });

    // store the token in variable
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log(payload);
      toast(payload.notification.body, {
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
    });
  }, [isLoggedIn, token]);

  console.log("logged in: ", isLoggedIn);
  console.log("FCM TOKEN = ", fcmToken);

  const updateFcmToken = async (decodedToken, FCMtoken) => {
    const userId = decodedToken.userId || decodedToken.registrationId;

    try {
      const response = await axios.put("https://expense-tracker-backend-rav8.onrender.com/api/v1/auth/update-fcm-token", {
        userId,
        newFcmToken: FCMtoken,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error updating FCM token:", error.message);
    }
  };

  const handleLogin = (tokenValue, navigate) => {
    setToken(tokenValue);
    setIsLoggedIn(true);
    // Navigate to dashboard after login
    navigate("/dashboard");
  };

  return (
    <>
      <Router>
        <AppRoutes handleLogin={handleLogin} fcmToken={fcmToken} />
      </Router>
      <Toaster position="top-center" />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </>
  );
}

function AppRoutes({ handleLogin, fcmToken }) {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage onLogin={(token) => handleLogin(token, navigate)} fcmToken={fcmToken} />} />
      <Route path="/signup" element={<SignupPage onSignup={(token) => handleLogin(token, navigate)} fcmToken={fcmToken} />} />
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/income" element={<IncomePage />} />
      <Route path="/expenses" element={<ExpensePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/reminders" element={<ReminderPage />} />
      {/* Add other routes here */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
