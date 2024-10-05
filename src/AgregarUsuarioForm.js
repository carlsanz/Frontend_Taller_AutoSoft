import React, { useState } from 'react';
import axios from 'axios';

const AgregarUsuarioForm = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/usuarios/agregar', {
                nombre,
                email,
                password,
                role: 'Mecanico',  // El rol siempre será 'Mecanico'
            });
            alert(response.data.message);  // Mostrar mensaje de éxito
        } catch (error) {
            alert(error.response?.data?.message || 'Error al agregar el usuario');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                required
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
            />
            <button type="submit">Agregar Usuario</button>
        </form>
    );
};

export default AgregarUsuarioForm;