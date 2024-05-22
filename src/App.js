import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Inv, Map,Doner,User,Terms,DB } from './components';
import "./App.css";

function App() {
  return (
    
      <Router>
        <Routes>
          <Route
            path="/"
            element={<><Navigate to="/donator" replace /></>}
          />
          <Route path="/donator" element={<Doner />} />
          <Route path="/database" element={<DB />} />
          {/* <Route path="/inventory" element={<Inv />} /> */}
          <Route path="/harta" element={<Map />} />
          <Route path="/user" element={<User />} />
          <Route path="/terms" element={<Terms />} />

        </Routes>

      </Router>
    
  );
}

export default App;
