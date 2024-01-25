import React, { useState } from 'react';
import axios from "axios";
const User = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [cnp, setCnp] = useState('');
  const [user, setUser] = useState('');

  const createChangeHandler = (setStateFunction) => (event) => {
    setStateFunction(event.target.value);
  };

  const handleUserChange = createChangeHandler(setUser);

  const handleCnpChange = (event) => {
    // Allow only numeric values
    const result = event.target.value.replace(/\D/g, '');
    // Limit the length to 13 digits
    if (result.length > 13) {
      return;
    }

    setCnp(result);
  };

  const addData = () => {
    if (!cnp || !user) {
      alert('Fields not completed');
      return;
    }
    let Data = {
      details: JSON.stringify({
        namele : user,
        CNP : cnp
      }),
    };

    console.log("Request Data:", Data);
    // Make the API request only if itemToAdd is not empty
    axios.post(`/api/add/${user}/${cnp}`, Data).then(() => {
      setCnp('');
      setUser('');
    });
  };

  return (
    <div className={`container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="wrapper">
        <div className={`add_input ${darkMode ? 'dark-mode-fields' : ''}`}>
          <input
            className={`input ${darkMode ? 'dark-mode-input' : ''}`}
            type="text"
            value={user}
            onChange={handleUserChange}
            placeholder="Numele si prenumele"
          />
          <input
            className={`input ${darkMode ? 'dark-mode-input' : ''}`}
            type="text"
            value={cnp}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
            onChange={handleCnpChange}
            placeholder="CNP"
          />

          {/* ... (other input elements) */}

          <button
            className={`button ${darkMode ? 'dark-mode-button' : ''}`}
            onClick={addData}
          >
            Take Item
          </button>
        </div>
        <div className="logo-container"></div>
      </div>
    </div>
  );
};

export default User;
