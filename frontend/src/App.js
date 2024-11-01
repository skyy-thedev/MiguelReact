import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './components/AuthContext'; 
import Home from './screens/home';
import Login from './screens/login';
import Registrar from './screens/register';
import Dashboard from './screens/dashboard';
import Agendamentos from './screens/agendamentos';
import ScreenProcedimentos from './screens/procedimentos';


function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Registrar" element={<Registrar />} />
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Procedimentos" element={<ScreenProcedimentos />} />
            <Route path="/Agendamentos" element={<Agendamentos />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;