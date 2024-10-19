import React, { useState } from 'react';
import './Clientes.css'; // Asegúrate de tener los estilos necesarios
import Modal from 'react-modal'; // Asegúrate de tener react-modal instalado

Modal.setAppElement('#root'); // Cambia '#root' por el ID de tu elemento raíz

const AgregarUsuario = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
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
        Correo: '',
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
        
        console.log('Datos que se envían:', formData); // Log de los datos que se envían

        try {
            // 1. Enviar datos del Usuario
            const userResponse = await fetch('http://localhost:5000/usuarios', { // Cambia a la URL correcta
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Nombre: formData.Nombre,
                    Email: formData.Email,
                    Contraseña: formData.Contraseña,
                    Rol: formData.Rol
                }),
            });

            if (!userResponse.ok) {
                const errorData = await userResponse.json(); // Captura el error para ver qué está fallando
                console.error('Error al agregar usuario:', errorData); // Muestra el error en la consola
                throw new Error('Error al agregar usuario');
            }

            const user = await userResponse.json(); // Obtener el ID de usuario creado

            // 2. Enviar datos de Persona
            console.log('Datos de Persona que se envían:', {
                Identidad: formData.Identidad,
                Id_colonia: formData.Id_colonia,
                P_nombre: formData.P_nombre,
                S_nombre: formData.S_nombre,
                P_apellido: formData.P_apellido,
                S_apellido: formData.S_apellido,
                Direccion: formData.Direccion,
                Telefono: formData.Telefono,
                Fecha_nac: formData.Fecha_nac,
                Correo: formData.Correo,
                Genero: formData.Genero
            });

            const personaResponse = await fetch('http://localhost:5000/personas', { // Cambia a la URL correcta
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Identidad: formData.Identidad,
                    Id_colonia: formData.Id_colonia,
                    P_nombre: formData.P_nombre,
                    S_nombre: formData.S_nombre,
                    P_apellido: formData.P_apellido,
                    S_apellido: formData.S_apellido,
                    Direccion: formData.Direccion,
                    Telefono: formData.Telefono,
                    Fecha_nac: formData.Fecha_nac,
                    Correo: formData.Correo,
                    Genero: formData.Genero
                }),
            });

            if (!personaResponse.ok) {
                const errorData = await personaResponse.json(); // Captura el error para ver qué está fallando
                console.error('Error al agregar persona:', errorData); // Muestra el error en la consola
                throw new Error('Error al agregar persona');
            }

            // 3. Enviar datos de Empleado
            console.log('Datos de Empleado que se envían:', {
                Identidad: formData.Identidad,
                Ocupacion: formData.Ocupacion,
                Salario: formData.Salario,
                Fecha_contratacion: formData.Fecha_contratacion,
                Id_usuario: user.Id_usuario // Asegúrate de que esto sea el ID correcto
            });

            const empleadoResponse = await fetch('http://localhost:5000/empleados', { // Cambia a la URL correcta
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Identidad: formData.Identidad,
                    Ocupacion: formData.Ocupacion,
                    Salario: formData.Salario,
                    Fecha_contratacion: formData.Fecha_contratacion,
                    Id_usuario: user.Id_usuario // Asegúrate de que esto sea el ID correcto
                }),
            });

            if (!empleadoResponse.ok) {
                const errorData = await empleadoResponse.json(); // Captura el error para ver qué está fallando
                console.error('Error al agregar empleado:', errorData); // Muestra el error en la consola
                throw new Error('Error al agregar empleado');
            }

            alert('Datos agregados exitosamente');
            setIsModalOpen(false);
            // Limpiar el formulario
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
                Correo: '',
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
                    <input type="text" name="Direccion" value={formData.Direccion} onChange={handleInputChange} required />

                    <label>Teléfono</label>
                    <input type="text" name="Telefono" value={formData.Telefono} onChange={handleInputChange} />

                    <label>Fecha de Nacimiento</label>
                    <input type="date" name="Fecha_nac" value={formData.Fecha_nac} onChange={handleInputChange} required />

                    <label>Correo</label>
                    <input type="email" name="Correo" value={formData.Correo} onChange={handleInputChange} required />

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

                    <button type="submit">Enviar</button>
                </form>
                <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
            </Modal>
        </div>
    );
};

export default AgregarUsuario;
