import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();

  // Define a mapping between route paths and their corresponding link destinations and texts
  const routes = [
    { path: '/harta', destination: '/database', text: 'Database' },
    { path: '/inventory', destination: '/inventory', text: 'Inventory' },
    // Add more routes as needed
  ];

  // Find the route data for the current path
  const currentRoute = routes.find((route) => route.path === location.pathname);

  // Default to 'Harta' if the current route is not in the mapping
  const linkText = currentRoute ? currentRoute.text : 'Harta';

  return (
    <div className={`navbar ${darkMode ? 'dark' : 'light'}`}>
      <Link to={currentRoute ? currentRoute.destination : '/harta'} className="nav-link">
        {linkText}
      </Link>
      <Link to="/inventory" className={`nav-link ${location.pathname === '/inventory' ? 'active' : ''}`}>
        Inventory
      </Link>
      <button className="dark-mode-button size" onClick={toggleDarkMode}>
        {darkMode ? '🌞' : '🌙'}
      </button>
    </div>
  );
};

export default Navbar;
