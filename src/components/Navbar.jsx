import React from 'react';
import { FaBars } from 'react-icons/fa';
import { AiOutlineUser, AiOutlineBell, AiOutlineLogout } from 'react-icons/ai';
import { MdAlarm } from 'react-icons/md';
import Cookies from 'js-cookie'; // Importing js-cookie
import '../styles/Navbar.css';
import logo from '../assets/Logo1.jpg';

const Navbar = () => {

  const handleLogout = () => {
    // Remove token from cookies
    Cookies.remove('token');

    // Redirect or perform other logout-related actions as needed
    window.location.href = '/login'; // Redirect to login assuming '/login' is the route for login
  };

  const toggleMenu = () => {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');
  };
  

  return (
    <nav className="navbar">
      <div className="container">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
          <h1 className="logo-text">Budget Buddy</h1>
        </div>
        <button className="menu-icon" onClick={toggleMenu}>
          <FaBars />
        </button>
        <ul className="nav-menu">
          <li className="nav-item">
            <a href="/profile" className="nav-link"><AiOutlineUser />Profile</a>
          </li>
          <li className="nav-item">
            <a href="/income" className="nav-link">Income</a>
          </li>
          <li className="nav-item">
            <a href="/expenses" className="nav-link">Expenses</a>
          </li>
          <li className="nav-item">
            <a href="/reminders" className="nav-link">Reminder</a>
          </li> 
          <li className="nav-item">
            <button className="nav-link logout-button" onClick={handleLogout}>
              <AiOutlineLogout />
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
