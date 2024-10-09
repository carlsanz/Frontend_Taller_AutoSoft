import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const ChangePassword = () => {
    const [email, setEmail] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isFirstLogin, setIsFirstLogin] = useState(false);
    const role = localStorage.getItem('role');  // Tomamos el rol del localStorage
    const navigate = useNavigate(); // Inicializa useNavigate

    useEffect(() => {
        // Verificar si es el primer inicio de sesión
        const checkFirstLogin = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/check-first-login/${email}`);
                setIsFirstLogin(response.data.firstLogin);
            } catch (error) {
                console.error('Error al verificar el primer inicio de sesión:', error);
            }
        };

        if (role === 'Mecanico') {
            checkFirstLogin();
        }
    }, [email, role]);

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

            // Redirigir a home después de cambiar la contraseña
            navigate('/home');
        } catch (error) {
            alert(error.response ? error.response.data.message : 'Error al cambiar la contraseña');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Cambiar Contraseña</h2>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

            {role === 'Mecanico' && isFirstLogin && (
                <p>Como es tu primer inicio de sesión, debes cambiar tu contraseña.</p>
            )}

            {role === 'Mecanico' && (
                <>
                    {isFirstLogin && (
                        <label>Nueva Contraseña (obligatorio para primer inicio)</label>
                    )}
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </>
            )}

            {role === 'Mecanico' && !isFirstLogin && (
                <>
                    <label>Contraseña Anterior</label>
                    <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                </>
            )}

            <label>Nueva Contraseña</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />

            <button type="submit">Cambiar Contraseña</button>
        </form>
    );
};

export default ChangePassword;
