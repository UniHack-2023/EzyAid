import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DarkModeProvider } from './darkModeContext';
import { Inv, Map,Doner,User } from './components';
import "./App.css";
import "./dark-mode.css";

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<><Navigate to="/donator" replace /></>}
          />
          <Route path="/donator" element={<Doner />} />
          {/* <Route path="/database" element={<DB />} /> */}
          <Route path="/inventory" element={<Inv />} />
          <Route path="/harta" element={<Map />} />
          <Route path="/user" element={<User />} />

        </Routes>

      </Router>
    </DarkModeProvider>
  );
}

export default App;
