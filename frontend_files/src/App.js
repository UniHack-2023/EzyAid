
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import {Signup,Login,Homepage} from './pages';


function App() {
  
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {/* Redirect to /signup */}
              <Navigate to="/signup" replace />
            </>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Homepage />} />
        {/* Add other routes as needed */}
      </Routes>
    </Router>

  );
}

export default App;
