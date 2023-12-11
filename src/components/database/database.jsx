import React, { useState, useEffect } from "react";
import axios from "axios";
import "./database.css";

const Database = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [itemToAdd, setItemToAdd] = useState("");
  const [countToAdd, setCountToAdd] = useState(1);
  const [searchItem, setSearchItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("1");

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
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  const renderSizeOptions = () => {
    if (selectedCategory === "1") {
      return (
        <select id="sizes">
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="SM">SM</option>
          <option value="M">M</option>
          <option value="ML">ML</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      );
    } else if (selectedCategory === "2") {
      return (
        <select id="shoe-sizes">
          <option value="36">36</option>
          <option value="37">37</option>
          <option value="38">38</option>
          <option value="39">39</option>
          <option value="40">40</option>
          <option value="41">41</option>
          <option value="42">42</option>
          <option value="43">43</option>
        </select>
      );
    } else {
      return null;
    }
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
        <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
            <option value="1">Imbracaminte</option>
            <option value="2">Incaltaminte</option>
          </select>
          {renderSizeOptions()}
          <input
            className="input"
            type="text"
            value={itemToAdd}
            onChange={handleItemToAddChange}
            placeholder="Numele produsului"
          />
          <input
            className=" input"
            type="number"s
            value={countToAdd}
            onChange={handleCountToAddChange}
            placeholder="Cantitate"
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
            <th className="th">Category</th>
            <th className="th">Size</th>
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
