import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DarkModeProvider } from './darkModeContext' // Adjust the path accordingly
import { DB, Inv, Map } from './components';
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
                <Navigate to="/database" replace />
              </>
            }
          />
          <Route path="/database" element={<DB />} />
          <Route path="/inventory" element={<Inv />} />
          <Route path="/harta" element={<Map />} />
        </Routes>
    </Router>
    </DarkModeProvider>
  );
}

export default App;
