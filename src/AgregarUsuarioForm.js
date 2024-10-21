import React, { useState } from 'react';
import './Clientes.css'; 
import Modal from 'react-modal'; 

Modal.setAppElement('#root'); 

const AgregarUsuario = () => {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstLogin, setFirstLogin] = useState(true); // Campo para primer inicio de sesión

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/usuarios-completo', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error al agregar usuario:', errorData);
                throw new Error('Error al agregar usuario');
            }

            alert('Datos agregados exitosamente');
            setIsModalOpen(false);
            setFormData({
                Nombre: '',
                Email: '',
                Contraseña: '',
                Rol: '',
                Identidad: '',
                Id_colonia: '',
                P_nombre: '',
                S_nombre: '',
                P_apellido: '',
                S_apellido: '',
                Direccion: '',
                Telefono: '',
                Fecha_nac: '',
                Genero: '',
                Ocupacion: '',
                Salario: '',
                Fecha_contratacion: ''
            });
        } catch (error) {
            alert('Error al agregar los datos');
            console.error('Error:', error);
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
