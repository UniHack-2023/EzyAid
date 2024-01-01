import React from 'react';
import { Link } from 'react-router-dom';
import './navbar.css'
const Navbar = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className={`navbar ${darkMode ? 'dark' : 'light'}`}>
      <Link to="/harta" className="nav-link">
        Harta
      </Link>
      <Link to="/inventory" className="nav-link">
        Inventory
      </Link>
      <button className="dark-mode-button" onClick={toggleDarkMode}>
        {darkMode ? '🌞' : '🌙'}
      </button>
    </div>
  );
};

export default Navbar;
