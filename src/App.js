import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

import LoginForm from './LoginForm';
import Home from './Home';
import AgregarUsuarioForm from './AgregarUsuarioForm';
import ChangePassword from './ChangePassword';
import Clientes from './Clientes';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/agregar-usuario" element={<AgregarUsuarioForm />} />
                <Route path="/cambiar-contraseña" element={<ChangePassword />} />
                <Route path="/clientes" element={<Clientes />} />
            </Routes>
        </Router>
    );
}

export default App;



