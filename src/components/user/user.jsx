import React, { useState,useEffect } from 'react';
import axios from "axios";

const User = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [cnp, setCnp] = useState('');
  const [user, setUser] = useState('');
  const [items, setItems] = useState([]);
  const preselectedLocation = "Pit";
  const [cnpDetails, setCnpDetails] = useState(null);

  const createChangeHandler = (setStateFunction) => (event) => {
    setStateFunction(event.target.value);
  };

  const handleUserChange = createChangeHandler(setUser);
  const handleItemChange = (event) => {
    // Handle item change here
  };
  const handleCnpChange = (event) => {
    // Allow only numeric values
    const result = event.target.value.replace(/\D/g, '');
    // Limit the length to 13 digits
    if (result.length <= 13) {
      setCnp(result);
    }
  };

  const validateCNP = () => {
    if (cnp.length !== 13) {
      alert('CNP must be 13 characters long.');
      return false;
    }

    // CNP validation logic
    const cnpDigits = cnp.split('').map(Number);
    const controlKey = [2, 7, 9, 1, 4, 6, 3, 5, 8, 2, 7, 9];
    let sum = 0;

    for (let i = 0; i < 12; i++) {
      sum += cnpDigits[i] * controlKey[i];
    }

    const remainder = sum % 11;
    const validControlKey = remainder === 10 ? 1 : remainder;
    if (validControlKey !== cnpDigits[12]) {
      alert('Invalid CNP.');
      return false;
    }

    // Extract location and date
    const judetArray = [
      'Alba', 'Arad', 'Arges', 'Bacau', 'Bihor', 'Bistrita-Nasaud', 'Botosani', 'Brasov', 'Braila', 'Buzau',
      'Caras-Severin', 'Cluj', 'Constanta', 'Covasna', 'Dambovita', 'Dolj', 'Galati', 'Gorj', 'Harghita',
      'Hunedoara', 'Ialomita', 'Iasi', 'Ilfov', 'Maramures', 'Mehedinti', 'Mures', 'Neamt', 'Olt', 'Prahova',
      'Satu Mare', 'Salaj', 'Sibiu', 'Suceava', 'Teleorman', 'Timis', 'Tulcea', 'Vaslui', 'Valcea', 'Vrancea',
      'Bucuresti', 'Bucuresti S1', 'Bucuresti S2', 'Bucuresti S3', 'Bucuresti S4', 'Bucuresti S5', 'Bucuresti S6',
      'Calarasi', 'Giurgiu'
    ];
    const judet = 10 * cnpDigits[7] + cnpDigits[8];
    const location = judetArray[judet - 1];

    let an, luna, zi;
    an = 10 * cnpDigits[1] + cnpDigits[2];

    if (cnpDigits[0] < 3) {
      an += 1900;
    } else if (cnpDigits[0] < 5) {
      an += 1800;
    } else if (cnpDigits[0] < 7) {
      an += 2000;
    } else {
      an += 1900;
    }

    luna = 10 * cnpDigits[3] + cnpDigits[4];
    zi = 10 * cnpDigits[5] + cnpDigits[6];

    const dateOfBirth = `${zi}.${luna}.${an}`;

    // Set CNP details
    setCnpDetails({ location, dateOfBirth });

    alert(location+", "+dateOfBirth);

    return true;
  };

  const addData = () => {
    if (!cnp || !user) {
      alert('Fields not completed.');
      return;
    }

    if (!validateCNP()) {
      return;
    }

    const data = {
      details: JSON.stringify({
        namele: user,
        CNP: cnp
      }),
    };

    axios.post(`/api/add/${user}/${cnp}`, data)
      .then(() => {
        setCnp('');
        setUser('');
        setCnpDetails(null);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          alert(' CNP already exissts.');
        } else {
          console.error('Error adding data:', error);
          alert('Error adding data. Please try again later.');
        }
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
            onChange={handleCnpChange}
            placeholder="CNP"
          />
          <select
            className={`select ${darkMode ? 'dark-mode-select' : ''}`}
            onChange={handleItemChange}
          >
            <option value="">Select Item</option>
            {items.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
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
