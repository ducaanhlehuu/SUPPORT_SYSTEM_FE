import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
// Import Pages
import DecisionSupportPage from './pages/DecisionSupportPage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<DecisionSupportPage />} />
        </Routes>
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;