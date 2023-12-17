import React, { useState, useEffect } from "react";
import axios from "axios";

const Inv = () => {
    const [inventory, setInventory] = useState(null); // Use null as the initial state

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
        <div>
            {inventory ? (
                <p>{JSON.stringify(inventory, null, 2)}</p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default Inv;
