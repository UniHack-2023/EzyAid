import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './navbar.css';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const location = useLocation();

  // Define a mapping between route paths and their corresponding link destinations and texts
  const routes = [
    { path: '/harta', destination: '/harta', text: 'Harta' },
    { path: '/inventory', destination: '/inventory', text: 'Inventory' },
    { path: '/doner', destination: '/doner', text: 'Doner' },
    // Add more routes as needed
  ];

  // Find the route data for the current path
  const currentRoute = routes.find((route) => route.path === location.pathname);

  return (
    <div className={`navbar ${darkMode ? 'dark' : 'light'}`}>
      {/* Dynamically create links based on the current route */}
      {routes.map((route) =>
        route.path !== location.pathname ? (
          <Link
            key={route.path}
            to={route.destination}
            className={`nav-link ${location.pathname === route.destination ? 'active' : ''}`}
          >
            {route.path === location.pathname ? currentRoute.text : route.text}
          </Link>
        ) : null
      )}
      <button className="dark-mode-button size" onClick={toggleDarkMode}>
        {darkMode ? '🌞' : '🌙'}
      </button>
    </div>
  );
};

export default Navbar;
