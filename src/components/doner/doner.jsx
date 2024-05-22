import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Database = () => {
  const [itemToAdd, setItemToAdd] = useState("");
  const [sizeToAdd, setSizeToAdd] = useState("XS");
  const [shoeSizeToAdd, setShoeSizeToAdd] = useState("36");
  const [countToAdd, setCountToAdd] = useState(1);
  const [Location, setLocation] = useState("");
  const [color, setColor] = useState("");
  const [coords, setCoords] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Imbracaminte");
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    axios.get("/locatii")
      .then(response => {
        const fetchedLocations = Object.keys(response.data).map(location => ({
          name: location,
          coords: response.data[location].coords,
        }));
        setLocations(fetchedLocations);
      })
      .catch(error => {
        console.error("Error fetching locations:", error);
      });
  }, []);
  const createChangeHandler = (setStateFunction) => (event) => {
    setStateFunction(event.target.value);
  };
  
  const handleItemToAddChange = createChangeHandler(setItemToAdd);
  const handleCountToAddChange = (event) => {
    const result = event.target.value.replace(/\D/g, "");
    if (result.length <= 13) {
      setCountToAdd(result);
    }
  };
  const handleCategoryChange = createChangeHandler(setSelectedCategory);
  const handleSizeChange = createChangeHandler(setSizeToAdd);
  const handleShoeSizeChange = createChangeHandler(setShoeSizeToAdd);
  const handleLocation = createChangeHandler(setLocation);
  const handleColor = createChangeHandler(setColor);


  const renderSizeOptions = () => { 
    if (selectedCategory === "Imbracaminte") {
      return (
        <select id="sizes" value={sizeToAdd} onChange={handleSizeChange} className='select'>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="SM">SM</option>
          <option value="M">M</option>
          <option value="ML">ML</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      );
    } else if (selectedCategory === "Incaltaminte") {
      return (
        <select
          id="shoe-sizes"
          value={shoeSizeToAdd}
          onChange={handleShoeSizeChange}
          className='select'
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
    if (!itemToAdd || !color || !Location) {
      alert("Fields cannot be empty!!");
      return;
    }
    if(countToAdd === 0){
      alert("Can not add 0 items!")
    }

    let requestData = {
      details: JSON.stringify({
        locatie: Location,
        category: selectedCategory,
        color: color,
        count: countToAdd,
        size: selectedCategory === "Imbracaminte" ? sizeToAdd : shoeSizeToAdd,
      }),
    };

    console.log("Request Data:", requestData);
    // Make the API request only if itemToAdd is not empty
    axios.post(`/api/${Location}/${itemToAdd}`, requestData).then(() => {
      setItemToAdd("");
      setCountToAdd(1);
      setLocation("");
      setColor("");
    });

  };
  const renderLocationOptions = () => {
    if (locations.length === 0) {
      return null;
    }

    return (
      <select
        id="location"
        value={Location}
        onChange={handleLocation}
        className='select'
      >
        {locations.map(location => (
          <option key={location.name} value={location.name}>
            {location.name} ({location.coords.join(', ')})
          </option>
        ))}
      </select>
    );
  };
  return (
    

    <div className='container'>
      <div className="wrapper">
        <div className='add_input'>
        {renderLocationOptions()}
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className='select'
          >
            <option value="Imbracaminte">Imbracaminte</option>
            <option value="Incaltaminte">Incaltaminte</option>
          </select>
          {renderSizeOptions()}
          <input
            className='input'
            type="text"
            value={itemToAdd}
            onChange={handleItemToAddChange}
            placeholder="Numele produsului"
          />
          <input
            className='input'
            type="text"
            value={color}
            onChange={handleColor}
            placeholder="Culoarea produsului"
          />
          <input
            className='input'
            type="text"

            value={countToAdd <= 0 ? 1 : countToAdd}
            onChange={handleCountToAddChange}
            placeholder="Cantitate"
          />
          <div className="flex gap-1">
          <button className='button adaugabtn w-[100px] ' onClick={handleAddItem}>
            Adauga produs
          </button>
          <button className='button mapbtn !w-[60px]'  onClick={() => navigate("/harta")}>
            
          </button>
          </div>

        </div>
        <div className="logo-container"></div>
      </div>

    </div>
  );
};

export default Database;
