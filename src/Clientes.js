import React, { useState } from 'react';
import './Clientes.css'; // Asegúrate de tener los estilos necesarios
import axios from 'axios';
import Modal from 'react-modal';

const Clientes = () => {
    const [identidad, setIdentidad] = useState('');
    const [cliente, setCliente] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({
        Identidad: '',
        Id_colonia: '',
        P_nombre: '',
        S_nombre: '',
        P_apellido: '',
        S_apellido: '',
        Direccion: '',
        Telefono: '',
        Fecha_nac: '',
        correo: '',
        Genero: 'Femenino', // Valor por defecto
    });
    const role = localStorage.getItem('role');

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/clientes/${identidad}`);
            setCliente(response.data);
            alert('Cliente encontrado');
            setFormData(response.data); // Cargar los datos en el formulario
            setIsModalOpen(true); // Abrir modal al encontrar el cliente
            setIsEditMode(false); // No modo edición al buscar
        } catch (error) {
            alert('Cliente no encontrado');
            setCliente(null);
        }
    };

    const handleAdd = () => {
        setIsModalOpen(true);
        setIsEditMode(false);
        setFormData({
            Identidad: '',
            Id_colonia: '',
            P_nombre: '',
            S_nombre: '',
            P_apellido: '',
            S_apellido: '',
            Direccion: '',
            Telefono: '',
            Fecha_nac: '',
            correo: '',
            Genero: 'Femenino',
        }); // Limpiar el formulario
    };

    const handleEdit = () => {
        if (cliente) {
            setIsModalOpen(true);
            setIsEditMode(true);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
            try {
                await axios.delete(`http://localhost:5000/api/clientes/${cliente.Identidad}`);
                alert('Cliente eliminado');
                setCliente(null);
                setIdentidad('');
                setIsModalOpen(false); // Cerrar modal al eliminar
            } catch (error) {
                alert('Error al eliminar el cliente');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isEditMode) {
            await axios.put(`http://localhost:5000/api/clientes/${formData.Identidad}`, formData);
            alert('Cliente actualizado');
        } else {
            await axios.post('http://localhost:5000/api/clientes', formData);
            alert('Cliente agregado');
        }

        setIsModalOpen(false);
        setCliente(null);
        setIdentidad('');
    };

    return (
        <div>
            <h2>Administrar Clientes</h2>
            <input
                type="text"
                placeholder="Buscar por número de identidad"
                value={identidad}
                onChange={(e) => setIdentidad(e.target.value)}
            />
            <button onClick={handleSearch}>Buscar</button>

            <button onClick={handleAdd} disabled={role !== 'Administrador' && !cliente}>
                Agregar Cliente
            </button>
            {role === 'Administrador' && (
                <>
                    <button onClick={handleEdit} disabled={!cliente}>Actualizar Cliente</button>
                    <button onClick={handleDelete} disabled={!cliente}>Eliminar Cliente</button>
                </>
            )}

            <Modal isOpen={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
                <h2>{isEditMode ? 'Editar Cliente' : 'Agregar Cliente'}</h2>
                <form onSubmit={handleSubmit}>
                    <label>Identidad</label>
                    <input type="text" name="Identidad" value={formData.Identidad} onChange={handleInputChange} required />

                    <label>Id Colonia</label>
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
                    <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} required />

                    <label>Género</label>
                    <select name="Genero" value={formData.Genero} onChange={handleInputChange}>
                        <option value="Femenino">Femenino</option>
                        <option value="Masculino">Masculino</option>
                    </select>

                    <button type="submit">{isEditMode ? 'Actualizar' : 'Agregar'}</button>
                </form>
            </Modal>
        </div>
    );
};

export default Clientes;
