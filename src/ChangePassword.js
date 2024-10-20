import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './ChangePassword.css';

const ChangePassword = () => {
    const [email, setEmail] = useState(localStorage.getItem('email') || ''); // Obtiene el email desde el localStorage o inicializa vacío
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const role = localStorage.getItem('role');  // Tomamos el rol del localStorage
    const navigate = useNavigate(); // Inicializa useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (role === 'Administrador') {
                // Petición para cambiar contraseña del mecánico
                const response = await axios.post('http://localhost:5000/api/password/admin', { email, newPassword });
                alert(response.data.message);
            } else if (role === 'Mecanico') {
                // Petición para cambiar contraseña del mecánico
                const response = await axios.post('http://localhost:5000/api/password/mecanico', { email, oldPassword, newPassword });
                alert(response.data.message);
            }

            
            navigate('/home');
        } catch (error) {
            // Manejo de errores
            const errorMessage = error.response?.data?.message || 'Error al cambiar la contraseña';
            alert(errorMessage);
        }
    };

    return (
        
        <form onSubmit={handleSubmit} id="form1">
            <header id="header">
            <h1>AUTOSOFT</h1>
            </header>

            <h2>Cambiar Contraseña</h2>
            <label>Correo Electrónico</label>
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
            />
            <label>Contraseña Anterior</label>
            <input 
                type="password" 
                value={oldPassword} 
                onChange={(e) => setOldPassword(e.target.value)} 
                required 
            />
            <label>Nueva Contraseña</label>
            <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
            />
            <button type="submit">Cambiar Contraseña</button>
        </form>
    );
};

export default ChangePassword;