import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext'; 
import Home from './screens/home';
import Login from './screens/login';
import Registrar from './screens/register';
import Dashboard from './screens/dashboard';


function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Registrar" element={<Registrar />} />
            <Route path="/Dashboard" element={<Dashboard />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;