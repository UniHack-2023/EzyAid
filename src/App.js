import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DarkModeProvider } from './darkModeContext';
import { DB, Inv, Map,Doner } from './components';
import "./App.css";
import "./dark-mode.css";

function App() {
  return (
    <DarkModeProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {/* Redirect to /database */}
                <Navigate to="/doner" replace />
              </>
            }
          />
          <Route path="/doner" element={<Doner />} />
          <Route path="/database" element={<DB />} />
          <Route path="/inventory" element={<Inv />} />
          <Route path="/harta" element={<Map />} />
        </Routes>
      </Router>
    </DarkModeProvider>
  );
}

export default App;
