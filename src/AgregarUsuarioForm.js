import React, { useState } from 'react';
import './Clientes.css'; // Asegúrate de tener los estilos necesarios
import Modal from 'react-modal'; // Asegúrate de tener react-modal instalado

Modal.setAppElement('#root'); // Cambia '#root' por el ID de tu elemento raíz

const AgregarUsuario = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        Nombre: '',
        Email: '', // Este es el único campo de correo
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

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
        <div>
            <h2>Agregar Usuario y Empleado</h2>
            <button onClick={() => setIsModalOpen(true)}>Agregar</button>
            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                <h2>Formulario de Registro</h2>
                <form onSubmit={handleSubmit}>
                    {/* Campos de Usuarios */}
                    <h3>Datos de Usuario</h3>
                    <label>Nombre</label>
                    <input type="text" name="Nombre" value={formData.Nombre} onChange={handleInputChange} required />

                    <label>Email</label>
                    <input type="email" name="Email" value={formData.Email} onChange={handleInputChange} required />

                    <label>Contraseña</label>
                    <input type="password" name="Contraseña" value={formData.Contraseña} onChange={handleInputChange} required />

                    <label>Rol</label>
                    <input type="text" name="Rol" value={formData.Rol} onChange={handleInputChange} required />

                    {/* Campos de Personas */}
                    <h3>Datos de Persona</h3>
                    <label>Identidad</label>
                    <input type="text" name="Identidad" value={formData.Identidad} onChange={handleInputChange} required />

                    <label>Id de Colonia</label>
                    <input type="number" name="Id_colonia" value={formData.Id_colonia} onChange={handleInputChange} required />

                    <label>Primer Nombre</label>
                    <input type="text" name="P_nombre" value={formData.P_nombre} onChange={handleInputChange} required />

                    <label>Segundo Nombre</label>
                    <input type="text" name="S_nombre" value={formData.S_nombre} onChange={handleInputChange} />

                    <label>Primer Apellido</label>
                    <input type="text" name="P_apellido" value={formData.P_apellido} onChange={handleInputChange} required />

                    <label>Segundo Apellido</label>
                    <input type="text" name="S_apellido" value={formData.S_apellido} onChange={handleInputChange} />

                    <label>Dirección</label>
                    <input type="text" name="Direccion" value={formData.Direccion} onChange={handleInputChange} />

                    <label>Teléfono</label>
                    <input type="text" name="Telefono" value={formData.Telefono} onChange={handleInputChange} />

                    <label>Fecha de Nacimiento</label>
                    <input type="date" name="Fecha_nac" value={formData.Fecha_nac} onChange={handleInputChange} required />

                    <label>Género</label>
                    <input type="text" name="Genero" value={formData.Genero} onChange={handleInputChange} required />

                    {/* Campos de Empleados */}
                    <h3>Datos de Empleado</h3>
                    <label>Ocupación</label>
                    <input type="text" name="Ocupacion" value={formData.Ocupacion} onChange={handleInputChange} required />

                    <label>Salario</label>
                    <input type="number" name="Salario" value={formData.Salario} onChange={handleInputChange} required />

                    <label>Fecha de Contratación</label>
                    <input type="date" name="Fecha_contratacion" value={formData.Fecha_contratacion} onChange={handleInputChange} required />

                    <button type="submit">Guardar</button>
                    <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
                </form>
            </Modal>
        </div>
    );
};

export default AgregarUsuario;