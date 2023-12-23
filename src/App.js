
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from "axios";
import {DB,Inv,Map}from './components'
import "./App.css";

function App() {
  
  return (
    <Router>
    <Routes>
      <Route
        path="/"
        element={
          <>
            {/* Redirect to /signup */}
            <Navigate to="/database" replace />
          </>
        }
      />
      <Route path="/database" element={<DB />} />
      {<Route path="/inventory" element={<Inv />} />}
      {<Route path="/harta" element ={<Map/>}/>}
      
    </Routes>
  </Router>
  );
}

export default App;
