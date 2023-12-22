import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from "axios";
import "./database.css";

const Database = () => {
  const [itemToAdd, setItemToAdd] = useState("");
  const [sizeToAdd, setSizeToAdd] = useState("XS");
  const [shoeSizeToAdd, setShoeSizeToAdd] = useState("36");
  const [countToAdd, setCountToAdd] = useState(1);
  const [searchItem, setSearchItem] = useState("");
  const [Location, setLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Imbracaminte");
  const navigate = useNavigate();

  const createChangeHandler = (setStateFunction) => (event) => {
    setStateFunction(event.target.value);
  };
  
  const handleItemToAddChange = createChangeHandler(setItemToAdd);
  const handleCountToAddChange = createChangeHandler(setCountToAdd);
  const handleSearchItemChange = createChangeHandler(setSearchItem);
  const handleCategoryChange = createChangeHandler(setSelectedCategory);
  const handleSizeChange = createChangeHandler(setSizeToAdd);
  const handleShoeSizeChange = createChangeHandler(setShoeSizeToAdd);
  const handleLocation = createChangeHandler(setLocation);

  const renderSizeOptions = () => {
    if (selectedCategory === "Imbracaminte") {
      return (
        <select id="sizes" value={sizeToAdd} onChange={handleSizeChange}>
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
        <select
          id="shoe-sizes"
          value={shoeSizeToAdd}
          onChange={handleShoeSizeChange}
        >
          <option value="36" defaultValue>
            36
          </option>
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
    if (!itemToAdd) {
      alert("Item name cannot be empty");
      return;
    }

    let requestData = {
      details: JSON.stringify({
        category: selectedCategory,
        locatie: Location,
        count: countToAdd,
        size: selectedCategory === "Incaltaminte" ? sizeToAdd : shoeSizeToAdd,
      }),
    };
    console.log("Request Data:", requestData);
    // Make the API request only if itemToAdd is not empty
    axios.post(`/api/add/${Location}/${itemToAdd}`, requestData).then(() => {
      setItemToAdd("");
      setCountToAdd(1);
      setLocation("");
    });
  };

  return (
    <div className="container">
      <div className="wrapper">
        <div className="add_input">
        <input
            className="input"
            type="text"
            value={Location}
            onChange={handleLocation}
            placeholder="Locatie"
          />
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <option value="Imbracaminte">Imbracaminte</option>
            <option value="Incaltaminte">Incaltaminte</option>
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
            className="input"
            type="number"
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
          <button className="button" onClick={() => navigate('/inventory')}>
            Inventory
          </button>
        </div>
        <div className="logo-container"></div>
      </div>
    </div>
  );
};

export default Database;
