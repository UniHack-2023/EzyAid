import React from 'react';
import { Link } from "react-router-dom";
import { useDarkMode } from '../../darkModeContext';
import './navbar.css'
const Navbar = () => {
  const { darkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className={`navbar ${darkMode ? 'dark' : 'light'}`}>
      <Link to="/harta" className="nav-link">
        Harta
      </Link>
      <Link to="/inventory" className="nav-link">
        Inventory
      </Link>
      <button className="dark-mode-button" onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
    </div>
  );
};

export default Navbar;
