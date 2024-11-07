import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

import LoginForm from './LoginForm';
import Home from './Home';
import AgregarUsuarioForm from './AgregarUsuarioForm';
import ChangePassword from './ChangePassword';
import Clientes from './Clientes';
import Servicios from './Servicios';
import Autos from './Autos'; // Importa el componente Autos
import Repuestos from './Repuestos';

function App() {
    const role = localStorage.getItem('role');
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/home" element={<Home />} />
                <Route path="/agregar-usuario" element={<AgregarUsuarioForm />} />
                <Route path="/cambiar-contraseña" element={<ChangePassword />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/servicios" element={<Servicios rolUsuario={role} />} />
                <Route path="/autos" element={<Autos />} />
                <Route path="/repuestos" element={<Repuestos />} />

            </Routes>
        </Router>
    );
}

export default App;



