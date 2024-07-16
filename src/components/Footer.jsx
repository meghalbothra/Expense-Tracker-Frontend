import React from 'react';
import "../styles/Footer.css";
import { FaLinkedin, FaGithub, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p>&copy; 2024 Budget Buddy. All rights reserved.</p>
          <div className="footer-links">
            <a href="mailto:meghalbothra@example.com" aria-label="Email">
              <FaEnvelope size="1.5em" />
            </a>
            <a href="https://www.linkedin.com/in/meghal-bothra/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin size="1.5em" />
            </a>
            <a href="https://github.com/meghalbothra" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FaGithub size="1.5em" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

