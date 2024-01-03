import React, { useState, useEffect } from "react";
import axios from "axios";
import "./inv.css"; // Import the stylesheet
import {Nav} from '../index';
const Inv = () => {
  const [inventory, setInventory] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/inventory");
        setInventory(response.data.inventory);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={`container2 ${darkMode ? "dark-mode" : ""}`}>
        <Nav darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      {inventory ? (
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
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
};

export default Inv;
