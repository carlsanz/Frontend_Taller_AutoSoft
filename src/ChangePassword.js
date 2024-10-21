import './AgregarUsuarios.css';
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

const ChangePassword = () => {
    const [email, setEmail] = useState(localStorage.getItem('email') || ''); // Obtiene el email desde el localStorage o inicializa vacío
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const navigate = useNavigate(); // Inicializa useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/password/mecanico', { 
                email, 
                oldPassword, 
                newPassword 
            });
            alert(response.data.message);
            navigate('/home'); // Redirige a la página principal después de cambiar la contraseña
        } catch (error) {
            // Manejo de errores
            const errorMessage = error.response?.data?.message || 'Error al cambiar la contraseña';
            alert(errorMessage);
        }
    };

    return (
        <div className='container'>
            <div className="form-header">
                <h2 className="form-title">...Cambiar contraseña</h2>
            </div>
            <form className='user-form' onSubmit={handleSubmit}>
                <label>Por seguridad debes cambiar tu contraseña</label>
                <input 
                    className="form-input"
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    className="form-input"
                    type="password" 
                    value={oldPassword} 
                    onChange={(e) => setOldPassword(e.target.value)} 
                    placeholder="Contraseña Anterior"
                    required 
                />
                <input 
                    className="form-input"
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="Nueva Contraseña"
                    required 
                />
                <button className='submit-button' type="submit">Cambiar Contraseña</button>
            </form>
        </div>
    );
};

export default ChangePassword;