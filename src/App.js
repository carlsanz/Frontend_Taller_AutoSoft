import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';

import LoginForm from './LoginForm';
import Home from './Home';
import AgregarUsuarioForm from './AgregarUsuarioForm';
import ChangePassword from './ChangePassword';
import Clientes from './Clientes';
import Servicios from './Servicios';
import Autos from './Autos'; 
import Repuestos from './Repuestos';
import Inventario from './Inventario';
import Nav from './Nav';
import Citas from './Citas';



function App() {
    const role = localStorage.getItem('role');

    return (
       
        <Router>
                <Nav />
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/agregar-usuario" element={<AgregarUsuarioForm />} />
                    <Route path="/cambiar-contraseña" element={<ChangePassword />} />
                    <Route path="/clientes" element={<Clientes />} />
                    <Route path="/servicios" element={<Servicios rolUsuario={role} />} />
                    <Route path="/autos" element={<Autos />} />
                    <Route path="/repuestos" element={<Repuestos />} />
                    <Route path="/inventario" element={<Inventario rolUsuario={role} />} />
                    <Route path="/citas" element={<Citas />} />
                </Routes>
        </Router>
    );
}

export default App;
