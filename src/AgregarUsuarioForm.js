import React, { useState } from 'react';
import axios from 'axios';
import './AgregarUsuarios.css';

const AgregarUsuario = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstLogin, setFirstLogin] = useState(true); // Campo para primer inicio de sesión

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/usuarios/agregar', { 
                nombre, 
                email, 
                contraseña: password,
                firstLogin // Se envía el campo firstLogin en la solicitud
            });
            alert(response.data.message);
        } catch (error) {
            alert(error.response?.data?.message || 'Error desconocido');
        }
    };

    return (
        <div className="form-container">
            <div className="form-header">
                <h2 className="form-title"> Creando usuario</h2>
                <button className="cancel-button" onClick={() => {/* lógica para cancelar */}}>
                    Cancelar
                </button>
            </div>
            <form className="user-form" onSubmit={handleSubmit}>
                <input
                    className="form-input"
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Nombre"
                    required
                />
                <input
                    className="form-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                />
                <input
                    className="form-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    required
                />
                <label>
                    Primer inicio de sesión:
                    <input
                        type="checkbox"
                        checked={firstLogin}
                        onChange={(e) => setFirstLogin(e.target.checked)}
                    />
                </label>
                <button className="submit-button" type="submit">Agregar Usuario</button>
            </form>
        </div>
    );
};

export default AgregarUsuario;

