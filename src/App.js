import React from 'react';
import { BrowserRouter  as Router, Route, Routes } from 'react-router-dom';
import Home from './screens/home'
import Login from './screens/login'
import Registrar from './screens/register'

function App() {
  return (
    <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Registrar" element={<Registrar />} />
          </Routes>
        </Router>
    </div>
  );
}

export default App;