import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
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

  useEffect(() => {
    const tokenCookie = document.cookie
      .split(';')
      .find((cookie) => cookie.trim().startsWith('token='));

    if (tokenCookie) {
      const tokenValue = tokenCookie.split('=')[1];
      setToken(tokenValue);
      setIsLoggedIn(true);

      const decodedToken = jwtDecode(tokenValue);
      console.log('Decoded Token:', decodedToken);

      // FCM Token generation
      generateToken().then((FCMtoken) => {
        setFcmToken(FCMtoken);
        // Update FCM token
        if (isLoggedIn) {
          updateFcmToken(decodedToken, FCMtoken);
        }
      });
    }
  }, [isLoggedIn]);

  // Function to update FCM token on the server
  const updateFcmToken = async (decodedToken, fcmToken) => {
    const userId = decodedToken.userId || decodedToken.registrationId;
    const role = decodedToken.role;
    try {
      const response = await axios.put("http://localhost:8000/api/v1/update-fcm-token", {
        userId,
        fcmToken,
        role,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error updating FCM token:", error.message);
    }
  };

  const handleLogin = (tokenValue) => {
    setToken(tokenValue);
    setIsLoggedIn(true);
    // Navigate to dashboard after login
    return <Navigate to="/dashboard" />;
  };

  useEffect(() => {
    // Initialize Firebase Messaging
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
  }, []);

  console.log("logged in: ", isLoggedIn);
  console.log("FCM TOKEN = ", fcmToken);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage onLogin={handleLogin} fcmToken={fcmToken} />} />
          <Route path="/signup" element={<SignupPage onSignup={handleLogin} fcmToken={fcmToken} />} />
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/expenses" element={<ExpensePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/reminders" element={<ReminderPage />} />
          {/* Add other routes here */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
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

export default App;
