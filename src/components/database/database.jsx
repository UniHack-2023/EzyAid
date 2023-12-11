import React, { useState, useEffect } from "react";
import axios from "axios";
import "./database.css";

const Database = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [itemToAdd, setItemToAdd] = useState("");
  const [countToAdd, setCountToAdd] = useState(1);
  const [searchItem, setSearchItem] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    // Filter the inventory based on the searchItem
    const filteredData = Object.keys(inventory).filter((item) =>
      item.toLowerCase().includes(searchItem.toLowerCase())
    );
    setFilteredInventory(filteredData);
  }, [inventory, searchItem]);

  const fetchInventory = () => {
    axios.get("/inventory").then((response) => {
      setInventory(response.data);
    });
  };

  const handleItemToAddChange = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleCountToAddChange = (event) => {
    setCountToAdd(event.target.value);
  };

  const handleSearchItemChange = (event) => {
    setSearchItem(event.target.value);
  };

  const handleAddItem = () => {
    // Check if itemToAdd is empty
    if (!itemToAdd) {
      alert("Item name cannot be empty");
      return;
    }

    // Make the API request only if itemToAdd is not empty
    axios.post(`/api/add/${itemToAdd}`, { count: countToAdd }).then(() => {
      fetchInventory();
      setItemToAdd("");
      setCountToAdd(1);
    });
  };

  return (
    <div className="container">
    <div className="wrapper">
      <div className="add_input">
        <input
          className="input"
          type="text"
          value={itemToAdd}
          onChange={handleItemToAddChange}
          placeholder="Enter item to add"
        />
        <input
          className=" input"
          type="number"
          value={countToAdd}
          onChange={handleCountToAddChange}
          placeholder="Enter item quantity"
        />
        <button className="button" onClick={handleAddItem}>
          Add Item
        </button>
        <input
          className="input input_search"
          type="text"
          value={searchItem}
          onChange={handleSearchItemChange}
          placeholder="Search item"
        />
      </div>
      <div className="logo-container">
        
      </div>
          </div>


      <table className="table">
        <thead>
          <tr>
            <th className="th">Item</th>
            <th className="th">Count</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((item) => (
            <tr key={item}>
              <td className="td">{item}</td>
              <td className="td">{inventory[item]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Database;
