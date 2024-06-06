import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Feedback from './pages/Feedback';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

function App() {
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="feedback" element={<Feedback />} />
      </Routes>
    </Router>
  );
}

export default App;
