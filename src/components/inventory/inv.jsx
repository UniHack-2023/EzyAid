import React, { useState, useEffect } from "react";
import axios from "axios";
import { Nav } from '../index';

const Inv = () => {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/inventory");
        setInventory(response.data.inventory);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  return (
    <div className={`container2 ${darkMode ? "dark-mode" : ""}`}>
      <Nav darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <div>
        <h2 className="heading">Inventory</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Items</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(inventory).map((location, index) => (
              <tr key={index}>
                <td>{location}</td>
                <td>
                  {inventory[location].map((item, itemIndex) => (
                    <span key={itemIndex} className="item-name">
                      {item.item}
                      {itemIndex < inventory[location].length - 1 && ", "}
                    </span>
                  ))}
                </td>
                <td>
                  {inventory[location].map((item, itemIndex) => (
                    <ul key={itemIndex} className="details">
                      {Object.keys(item.details).map((key, keyIndex) => (
                        <li key={keyIndex} className="detail">
                          <span className="detail-label">{key}:</span>
                          {Array.isArray(item.details[key]) ? (
                            <ul className="key-values">
                              {item.details[key].map((value, valueIndex) => (
                                <li key={valueIndex} className="detail-value">
                                  {value}
                                  {valueIndex < item.details[key].length - 1 && ", "}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="detail-value">{item.details[key]}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inv;
